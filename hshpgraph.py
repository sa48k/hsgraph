from lxml import etree
import glob, sys, os
import csv
import json
import string
import random
import time
import logging
import re
from datetime import datetime
from dateutil import parser

start_time = time.time()

# logging
file_handler = logging.FileHandler('debug.log')
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
logging.basicConfig(
    level=logging.DEBUG,
    handlers=[
        file_handler,
        console_handler
    ]
)

def getReplayURL(infile):
    with open(infile, "rb") as file:
        try:
            file.seek(-2, os.SEEK_END)
            while file.read(1) != b'\n':
                file.seek(-2, os.SEEK_CUR)
        except OSError:
            file.seek(0)
        last_line = file.readline().decode()
    
    
def generateID(length=8):
    chars = string.ascii_lowercase + string.ascii_uppercase + string.digits
    return(''.join(random.choice(chars) for i in range(length)))
    
def outputToCSV(player1, player2, result):
    # write result to csv with the top row: turn #, player names / classes
    # then an array of tuples showing hero HP at the end of each turn
    outfile = 'output.csv'
    print('Saving to ' + outfile)
    with open(outfile, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['turn', player1['name'] + '/' + player1['class'], player2['name'] + '/' + player2['class']])
        for count, t in enumerate(result):
            writer.writerow([count+1, *t])
        csvfile.close()

def generateJSON(metadata, p1, p2):
    output = {
        "id": generateID(),
        "timestamp": metadata['timestamp'],
        "gamelength": metadata['gamelength'],
        "player1": {
            "name": p1['name'],
            "class": p1['class'],
            "winner": True if p1.get('winner') else False
        },
        "player2": {
            "name": p2['name'],
            "class": p2['class'],
            "winner": True if p2.get('winner') else False
        },
        "matchdata": metadata['result']
    }
    return(output)

def buildData(infile):
    # rudimentary check that the xml is a HSreplay
    tree = etree.parse(infile)
    checkxml = tree.xpath('/HSReplay[@version][@build]/Game[@type="7" or @type="8"][@format="2"]') # standard ranked and casual only
    if len(checkxml) == 0:
        errmsg = 'Skipping - no valid HSReplay xml found\n'
        print(errmsg)
        return errmsg
    
    # initial setup: player dicts; empty array for results; timestamps and calculated game length
    players = tree.xpath('//Player')
    player1 = {}
    player2 = {}
    result = []
    timestamp = tree.xpath('//Game')[0].get('ts')
    endtime = tree.xpath('(//Block[@entity="1"])[last()]')[0].get('ts')
    d1 = parser.isoparse(timestamp)
    d2 = parser.isoparse(endtime)
    gamelength = round((d2 - d1).total_seconds()/60, 1) # in minutes, rounded to 1 decimal point
    
    player1['id'] = players[0].xpath('Tag[@tag="53"]')[0].get('value')          # either 2 or 3
    player1['name'] = players[0].get('name').split('#')[0]                      # username
    player1['entityid'] = players[0].xpath('Tag[@tag="27"]')[0].get('value')    # this can change when a hero card is played
    player1['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player1['entityid'] + '"]/parent::* ')[0].get('EntityName') 
    player1['starthealth'] = 30
    renathalcheck = tree.xpath('//Block[@type="5"]/TagChange[@tag="45"][@value="40"][@entity="' + player1['entityid'] + '"]')
    if renathalcheck: # check for Renathal and set starting health to 40 if needed
        player1['starthealth'] = 40    
    player1['damaged'] = 0
    player1['healed'] = 0
    player1['armor'] = 0

    # DRY - players should be stored as a tuple of dicts 
    player2['id'] = players[1].xpath('Tag[@tag="53"]')[0].get("value")
    player2['name'] = players[1].get('name').split('#')[0]
    player2['entityid'] = players[1].xpath('Tag[@tag="27"] ')[0].get('value')
    player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')
    player2['starthealth'] = 30
    renathalcheck = tree.xpath('//Block[@type="5"]/TagChange[@tag="45"][@value="40"][@entity="' + player2['entityid'] + '"]')
    if renathalcheck:
        player2['starthealth'] = 40  
    player2['damaged'] = 0
    player2['healed'] = 0
    player2['armor'] = 0

    # set initial classes (it might change later due to Maestra)
    lookup = {'HERO_01': 'Warrior', 'HERO_02': 'Shaman', 'HERO_03': 'Rogue', 'HERO_04': 'Paladin', 'HERO_05': 'Hunter', 'HERO_06': 'Druid', 'HERO_07': 'Warlock', 'HERO_08': 'Mage', 'HERO_09': 'Priest', 'HERO_10': 'Demon Hunter'}
    classes = tree.xpath('//FullEntity[starts-with(@cardID, "HERO_")]')
    player1['class'] = lookup[classes[0].get("cardID")[:7]]
    player2['class'] = lookup[classes[2].get("cardID")[:7]]

    logging.debug('Players:\n' + json.dumps(player1) + '\n' + json.dumps(player2))
    logging.info(f"{timestamp[:16]} - {player1['name']} ({player1['class']}) vs {player2['name']} ({player2['class']})")
    # from tree, get these events: next turn | damage | healing | armour | hero card
    #
    # Next turn: //Block//TagChange[@entity="1"][@tag="20"
    # <TagChange entity="1" tag="20" value="1" EntityCardID="GameEntity" EntityCardName="GameEntity" GameTagName="TURN"/>
    #
    # Damage: //Block//TagChange[@tag="44"]
    # <TagChange entity="39" tag="44" value="1" EntityCardID="SW_319" EntityCardName="Peasant" GameTagName="DAMAGE"/>
    #
    # Healing: //Block//MetaData[@meta="2"]
    # <MetaData meta="2" data="6" infoCount="1" MetaName="HEALING"> 
    #   <Info index="0" entity="18" EntityName="Kurtrus, Demon-Render"/> 
    # </MetaData>
    #
    # Armour: //Block//TagChange[@tag="292"]
    # <TagChange entity="18" tag="292" value="4" EntityCardID="AV_204" EntityCardName="Kurtrus, Demon-Render" GameTagName="ARMOR"/>
    #
    # Hero card: //Block[@type="7"]/TagChange[@tag="1828"]/..
    # <Block entity="17" type="7" block_sequence_num="206" EntityCardID="AV_113" EntityCardName="Beaststalker Tavish" BlockTypeName="PLAY">
    # ..
    #
    # Maestra reveal: //SubSpell[starts-with(@spellPrefabGuid, "SWFX_MaestraOfTheMasquerade_Ritual_Super")]
    # Like Hero Cards, these change the player's entity ID
    # <SubSpell spellPrefabGuid="SWFX_MaestraOfTheMasquerade_Ritual_Super:bbf4c69ff3cbadf469d0062df7eaacc2" source="80" targetCount="1" ts="2022-11-14T20:46:44.234990+13:00">
    #   <SubSpellTarget index="0" entity="76"/>                                 <- 76 is player's old entityid
    #   <FullEntity id="98" cardID="HERO_03" EntityName="Valeera Sanguinar">    <- 98 is the updated entityid
    
                         # next turn                                  # damage                        # healing                      # armour                         # hero card                                    # maestra
    events = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"] | //Block//TagChange[@tag="44"] | //Block//MetaData[@meta="2"] | //Block//TagChange[@tag="292"] | //Block[@type="7"]/TagChange[@tag="1828"]/.. | //Block/SubSpell[starts-with(@spellPrefabGuid, "SWFX_MaestraOfTheMasquerade_Ritual_Super")] ')
    turn = 1

    # def getPlayerHealth(player):
        # pass  # TODO
        
    # christ, this is a mess
    for event in events:
        # print(event.items()) # debug
        if event.get('tag') == '20':                 # next turn
            turn += 1
            p1hp = player1['starthealth'] - int(player1["damaged"]) + player1["healed"] + player1["armor"]
            p2hp = player2['starthealth'] - int(player2["damaged"]) + player2["healed"] + player2["armor"]
            logging.debug(f'{player1["name"]} (ID {player1["entityid"]}): {p1hp}')
            # if player1['armor']:
            #     logging.debug('({player1["armor"]} from armour)')
            logging.debug(f'{player2["name"]} (ID {player2["entityid"]}): {p2hp}')
            # if player2['armor']:
            #     logging.debug(f'({player2["armor"]} from armour)')
            if p1hp < 0:
                p1hp = 0
            if p2hp < 0:
                p2hp = 0
            result.append([p1hp, p2hp])
            logging.debug(f'Turn {int(turn/2)}')
        
        targetid = event.get('entity')
        if event.get('tag') == '44':                 # target receives damage
            if targetid != player1['entityid'] and targetid != player2['entityid']:   # only use this data if it damages either hero; skip everything else
                continue
            targetname = event.get('EntityCardName') # only works on annotated xmls, otherwise 'None'
            dmg = event.get('value')
            if dmg == '0':
                continue
            if targetid == player1['entityid']:      # keep track of damage to player (cumulative)
                player1['damaged'] = int(dmg)
                targetname = player1['name']
                player1['healed'] = 0
            elif targetid == player2['entityid']:
                player2['damaged'] = int(dmg)
                targetname = player2['name']
                player2['healed'] = 0
            logging.debug(f'{targetname} (ID: {targetid}) has received {dmg} damage')
            
        if event.get('meta') == '2':                 # heals target
            targetid = event.getchildren()[0].get('entity')
            targetname = event.getchildren()[0].get('EntityName')
            heal = int(event.get('data'))
            if targetid == player1['entityid']:     # keep track of healing so far (cumulative)
                player1['healed'] += heal           # this can get reset to zero when the player next takes damage
                targetname = player1['name']
            elif targetid == player2['entityid']:
                player2['healed'] += heal
                targetname = player2['name']
            else:
                continue
            logging.debug(f'{targetname} (ID: {targetid}) was healed for {heal}')
                
        if event.get('tag') == '292':                # change armor
            targetname = event.get('EntityCardName')
            armor = int(event.get('value'))
            if targetid == player1['entityid']:     # set armor value (not cumulative)
                player1['armor'] = armor
                targetname = player1['name']
            elif targetid == player2['entityid']:
                player2['armor'] = armor
                targetname = player2['name']
            else:
                continue
            logging.debug(f'Entity {targetid} ({targetname}) now has {armor} armour')
            
        if event.get('type') == '7':    # Hero card played
            logging.debug(event.items())
            controller = event.xpath('TagChange[@tag="1828"]')[0].get('entity')
            newarmor = 5 # hack
            newhero = event.get('EntityCardName')
            newentityid = event.get('entity')
            if controller == player1['id']:
                player1['entityid'] = newentityid
                player1['hero'] = newhero
                player1['armor'] += newarmor
                logging.debug(f'{player1["name"]} played a Hero card...')
            elif controller == player2['id']:
                player2['entityid'] = newentityid
                player2['hero'] = newhero
                player2['armor'] += newarmor
                logging.debug(f'{player2["name"]} played a Hero card...')
            logging.debug(f'...updating entity id to {event.get("entity")}')
            
        if event.xpath('../SubSpell/SubSpellTarget'):     # Maestra reveal
            logging.debug('SURPRISE!')
            controller = event.xpath('../SubSpell/SubSpellTarget')[0].get('entity')
            newentityid = event.xpath('../SubSpell/FullEntity')[0].get('id')
            print(controller, newentityid)
            if controller == player1['entityid']:
                player1['class'] = 'Rogue'
                player1['entityid'] = newentityid
                logging.info(f'Maestra: Updating player 1 entity id from {controller} to {newentityid}')
            elif controller == player2['entityid']:
                player2['class'] = 'Rogue'
                player2['entityid'] = newentityid
                logging.info(f'Maestra: Updating player 2 entity id from {controller} to {newentityid}')
            
    # outcome = tree.xpath('//TagChange[@tag="17"][@value="4"]|//TagChange[@tag="17"][@value="5"]')
    winner_id = tree.xpath('//TagChange[@tag="17"][@value="4"]')[0].get("entity")

    if winner_id == player1['id']:
        result.append([player1['starthealth'] - int(player1["damaged"]) + player1["healed"] + player1["armor"], 0])
        player1['winner'] = True
        logging.info(f"The winner was {player1['name']}\n")
    else:
        result.append([0, player2['starthealth'] - int(player2["damaged"]) + player2["healed"] + player2["armor"]])
        player2['winner'] = True
        logging.info(f"The winner was {player2['name']}\n")

    # outputToCSV(result)
    gamedata = {}
    gamedata['timestamp'] = timestamp
    gamedata['gamelength'] = gamelength
    gamedata['result'] = result
    return generateJSON(gamedata, player1, player2)

##########################################

logging.info(f'Looking for xml files in {os.getcwd()}')
filelist = glob.glob('*.xml')
if len(filelist) == 0:
    logging.info('No XML files found')
else:
    fulldata = []
    for f in filelist:
        logging.info(f'Loading {f}')
        matchjson = buildData(f)
        fulldata.append(matchjson)

    with open("matchdata_" + generateID(4) + ".json", "w") as outfile:
        logging.info(f'Writing {outfile.name} to {os.getcwd()}')
        output = [el for el in fulldata if el != None]          # remove empty elements
        outfile.write(json.dumps(output))
    
logging.info("--- %s seconds ---" % round((time.time() - start_time), 3))