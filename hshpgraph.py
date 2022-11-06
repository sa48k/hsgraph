from lxml import etree
import glob, sys, os
import csv
import json
import string
import random
import time
from datetime import datetime

start_time = time.time()

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

def generateJSON(timestamp, p1, p2, result):
    output = {
        "id": generateID(),
        "timestamp": timestamp,
        "player1": {
            "name": p1['name'],
            "class": p1['class']
        },
        "player2": {
            "name": p2['name'],
            "class": p2['class']
        },
        "matchdata": result
    }
    return(output)

def buildData(infile):
    # rudimentary check that the xml is a HSreplay
    tree = etree.parse(infile)
    checkxml = tree.xpath('/HSReplay[@version][@build]/Game[@type="7" or @type="8"][@format="2"]') # standard ranked and casual only, for now
    if len(checkxml) == 0:
        print('Skipping - no valid HSReplay xml found\n')
        return None
    # initial setup: tree, player dicts, empty array for results, ts
    players = tree.xpath('//Player')
    player1 = {}
    player2 = {}
    result = []
    timestamp = tree.xpath('//Game')[0].get("ts")

    player1['id'] = players[0].xpath('Tag[@tag="53"]')[0].get("value")          # either 2 or 3
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
    renathalcheck = tree.xpath('//Block[@type="5"]/TagChange[@tag="45"][@value="40"][@entity="' + player1['entityid'] + '"]')
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

    # handle maestra being played
    maestra = tree.xpath('//SubSpell[starts-with(@spellPrefabGuid, "SWFX_MaestraOfTheMasquerade_Ritual_Super")]')
    for m in maestra:
        if m.getchildren()[0].get('entity') == player1['entityid']:
            player1['class'] = 'Rogue'
        if m.getchildren()[0].get('entity') == player2['entityid']:
            player2['class'] = 'Rogue'
            
    print('Players:\n', player1, '\n', player2)

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

    events = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"] | //Block//TagChange[@tag="44"] | //Block//MetaData[@meta="2"] | //Block//TagChange[@tag="292"] | //Block[@type="7"]/TagChange[@tag="1828"]/.. ')
    currentturn = 1

    for event in events:
        # print(event.items()) # debug
        if event.get('tag') == '20':                 # next turn
            currentturn += 1
            p1hp = player1['starthealth'] - int(player1["damaged"]) + player1["healed"] + player1["armor"]
            p2hp = player2['starthealth'] - int(player2["damaged"]) + player2["healed"] + player2["armor"]
            print('-' * 40)
            print(f'{player1["hero"]} (ID {player1["entityid"]}): {p1hp}', end = " ")
            if player1['armor']:
                print(f'({player1["armor"]} from armour)', end = " ")
            print(f'\n{player2["hero"]} (ID {player2["entityid"]}): {p2hp}', end = " ")
            if player2['armor']:
                print(f'({player2["armor"]} from armour)')
                if p1hp < 0:
                    p1hp = 0
                if p2hp < 0:
                    p2hp = 0
            result.append([p1hp, p2hp])
            print(f'\n\nTurn {int(currentturn/2)}')
        
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
                player1['healed'] = 0
            elif targetid == player2['entityid']:
                player2['damaged'] = int(dmg)
                player2['healed'] = 0
            print(f'{targetname} (ID: {targetid}) has received {dmg} damage')
            
        if event.get('meta') == '2':                 # heals target
            targetid = event.getchildren()[0].get('entity')
            targetname = event.getchildren()[0].get('EntityName')
            heal = int(event.get('data'))
            if targetid == player1['entityid']:     # keep track of healing so far (cumulative)
                player1['healed'] += heal           # this can get reset to zero when the player next takes damage
            elif targetid == player2['entityid']:
                player2['healed'] += heal
            else:
                continue
            print(f'{targetname} (ID: {targetid}) was healed for {heal}')
                
        if event.get('tag') == '292':                # change armor
            targetname = event.get('EntityCardName')
            armor = int(event.get('value'))
            if targetid == player1['entityid']:     # set armor value (not cumulative)
                player1['armor'] = armor
            elif targetid == player2['entityid']:
                player2['armor'] = armor
            else:
                continue
            print(f'Entity {targetid} ({targetname}) now has {armor} armour')
            
        if event.get('type') == '7':    # Hero card played
            # print(event.items()) # debug
            controller = event.xpath('TagChange[@tag="1828"]')[0].get('entity')
            newarmor = 5 # hack
            newhero = event.get('EntityCardName')
            newentityid = event.get('entity')
            if controller == player1['id']:
                player1['entityid'] = newentityid
                player1['hero'] = newhero
                player1['armor'] += newarmor
                print(f'{player1["name"]} played a Hero card...')
            elif controller == player2['id']:
                player2['entityid'] = newentityid
                player2['hero'] = newhero
                player2['armor'] += newarmor
                print(f'{player2["name"]} played a Hero card...')
            print(f'...updating entity id to {event.get("entity")}, hero to {newhero}, and adding {newarmor} armour')
            
    # outcome = tree.xpath('//TagChange[@tag="17"][@value="4"]|//TagChange[@tag="17"][@value="5"]')
    winner_id = tree.xpath('//TagChange[@tag="17"][@value="4"]')[0].get("entity")

    if winner_id == player1['id']:
        result.append([player1['starthealth'] - int(player1["damaged"]) + player1["healed"] + player1["armor"], 0])
        print(f"\nThe winner was {player1['name']}")
    else:
        result.append([0, player2['starthealth'] - int(player2["damaged"]) + player2["healed"] + player2["armor"]])
        print(f"\nThe winner was {player2['name']}")

    # outputToCSV(result)
    return generateJSON(timestamp, player1, player2, result)

##########################################

print(f'Looking for xml files in {os.getcwd()}')
filelist = glob.glob('*.xml')
fulldata = []
for f in filelist:
    print(f'Loading {f}')
    matchjson = buildData(f)
    fulldata.append(matchjson)

with open("matchdata_" + generateID(4) + ".json", "w") as outfile:
    print(f'Writing {outfile.name} to {os.getcwd()}')
    output = [el for el in fulldata if el != None]
    outfile.write(json.dumps(output))
    
print("--- %s seconds ---" % round((time.time() - start_time), 3))