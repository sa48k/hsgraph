from lxml import etree
import csv

# tree = etree.parse("./data/PriestWinT5.xml")
tree = etree.parse("./data/BeastHunterWin_annotated.xml") # https://hsreplay.net/replay/LQ2unSYf7w7hLfBu5Foa6U
# tree = etree.parse("./data/BeastHunterWin2_annotated.xml") # https://hsreplay.net/replay/gRfknupKptbsozKXa7DnZk
# tree = etree.parse("./data/BH3_annotated.xml") # https://hsreplay.net/replay/gWZxEM78EtbWYUzxHtFyK8
# tree = etree.parse("./data/Healfest_annotated.xml") # priest healfest
# tree = etree.parse("./data/Armorfest_annotated.xml") # warrior armorfest

# set up player dicts
players = tree.xpath('//Player')
player1 = {}
player2 = {}
result = []

player1['id'] = players[0].xpath('Tag[@tag="53"]')[0].get("value") # either 2 or 3  # currently unused
player1['name'] = players[0].get('name').split('#')[0]
player1['controller'] = players[0].xpath('Tag[@tag="50"]')[0].get('value')
player1['entityid'] = players[0].xpath('Tag[@tag="27"]')[0].get('value') # TODO: Handle changes e.g. when Hero Cards are played
player1['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player1['entityid'] + '"]/parent::* ')[0].get('EntityName')
player1['starthealth'] = 30 #tree.xpath('//FullEntity[@id="' + player1['entityid'] + '"]/Tag[@tag="45"]')[0].get('value')
renathalcheck = tree.xpath('//Block[@EntityCardID="REV_018"]/TagChange[@tag="45"]')
if renathalcheck and renathalcheck[0].get('entity') == player1['entityid']: # check for Renathal
    player1['starthealth'] = 40    
player1['damaged'] = 0
player1['healed'] = 0  # edit: don't actually need this - the 'damaged' value is cumulative over the match and takes healing into account
player1['armor'] = 0

player2['id'] = players[1].xpath('Tag[@tag="53"]')[0].get("value")
player2['name'] = players[1].get('name').split('#')[0]
player2['controller'] = players[1].xpath('Tag[@tag="50"]')[0].get('value')
player2['entityid'] = players[1].xpath('Tag[@tag="27"] ')[0].get('value')
player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')
player2['starthealth'] = 30 # tree.xpath('//FullEntity[@id="' + player2['entityid'] + '"]/Tag[@tag="45"]')[0].get('value')
renathalcheck = tree.xpath('//Block[@EntityCardID="REV_018"]/TagChange[@tag="45"]')
if renathalcheck and renathalcheck[0].get('entity') == player2['entityid']: # check for Renathal
    player2['starthealth'] = 40  
player2['damaged'] = 0
player2['healed'] = 0
player2['armor'] = 0

print('Players:\n', player1, '\n', player2)

# from tree, get these events: next turn | damage | healing | armour | hero card
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
# Hero card:    //Block/ShowEntity/Tag[@tag="202"][@value="3"]/ancestor::ShowEntity/Tag[@tag="292"]/ancestor::ShowEntity  # HACK, must be a better way to do this
# <ShowEntity entity="18" cardID="AV_204" EntityName="Kurtrus, Demon-Render"> 
#   <Tag tag="50" value="1" GameTagName="CONTROLLER"/>
#   <Tag tag="202" value="3" GameTagName="CARDTYPE"/>
#   <Tag tag="53" value="18" GameTagName="ENTITY_ID"/>
#   <Tag tag="292" value="5" GameTagName="ARMOR"/> 
# </ShowEntity>

events = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"] | //Block//TagChange[@tag="44"] | //Block//MetaData[@meta="2"] | //Block//TagChange[@tag="292"] | //Block[@type="7"]/ShowEntity/Tag[@tag="202"][@value="3"]/ancestor::ShowEntity/Tag[@tag="292"]/ancestor::ShowEntity')
currentturn = 1

for event in events:
    # print(event.items()) # debug
    if event.get('tag') == '20':                 # next turn
        currentturn += 1
        p1hp = player1['starthealth'] - int(player1["damaged"]) + player1["armor"]
        p2hp = player2['starthealth'] - int(player2["damaged"]) + player2["armor"]
        print(f'{player1["hero"]} (ID {player1["entityid"]}): {p1hp}', end =" ")
        if player1['armor']:
            print(f'({player1["armor"]} from armour)')
        print(f'\n{player2["hero"]} (ID {player2["entityid"]}): {p2hp}', end =" ")
        if player2['armor']:
            print(f'({player2["armor"]} from armour)')
        result.append([p1hp, p2hp])
        print(f'\n\nTurn {int(currentturn/2)}')
    
    targetid = event.get('entity')
    if event.get('tag') == '44':                 # target receives damage
        if targetid != player1['entityid'] and targetid != player2['entityid']:   # only use this data if it damages either hero; skip everything else
            continue
        targetname = event.get('EntityCardName')
        dmg = event.get('value')
        if dmg == '0':
            continue
        if targetid == player1['entityid']:     # keep track of damage to player (cumulative)
            player1['damaged'] = int(dmg)
        elif targetid == player2['entityid']:
            player2['damaged'] = int(dmg)
        print(f'{targetname} (ID: {targetid}) has received {dmg} damage')
        
    if event.get('meta') == '2':                 # heals target
        targetid = event.getchildren()[0].get('entity')
        targetname = event.getchildren()[0].get('EntityName')
        heal = int(event.get('data'))
        if targetid == player1['entityid']:     # keep track of healing so far (cumulative)
            player1['healed'] += heal
        elif targetid == player2['entityid']:
            player2['healed'] += heal
        else:
            continue
        print(f'{targetname} (ID: {targetid}) was healed for {heal}')
            
    if event.get('tag') == '292':                # change armor
        targetid = event.get('entity')
        targetname = event.get('EntityCardName')
        armor = int(event.get('value'))
        if targetid == player1['entityid']:     # set armor value (not cumulative)
            player1['armor'] = armor
        elif targetid == player2['entityid']:
            player2['armor'] = armor
        else:
            continue
        print(f'Entity {targetid} ({targetname}) now has {armor} armour')
        
    if event.xpath('name()') == 'ShowEntity':    # Hero card played
        print(event.items())
        controller = event.xpath('Tag[@tag="50"]')[0].get('value')
        newarmor = int(event.xpath('Tag[@tag="292"]')[0].get('value'))
        newhero = event.get('EntityName')
        if controller == player1['controller']:
            player1['entityid'] = event.get('entity')
            player1['hero'] = newhero
            player1['armor'] = newarmor
            print(f'{player1["name"]} played a Hero card...')
        elif controller == player2['controller']:
            player2['entityid'] = event.get('entity')
            player2['hero'] = newhero
            player2['armor'] = newarmor
            print(f'{player2["name"]} played a Hero card...')
        print(f'...updating entity id to {event.get("entity")}, hero to {newhero}, and armour to {newarmor}')
        
# outcome = tree.xpath('//TagChange[@tag="17"][@value="4"]|//TagChange[@tag="17"][@value="5"]')
winner = tree.xpath('//TagChange[@tag="17"][@value="4"]')[0]
print(f"\nThe winner was {winner.get('EntityCardID').split('#')[0]}\n")

# temp solution: write to csv. when this works, make it export JSON to frontend instead
with open('out2.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['turn', player1['name'], player2['name']])
    for count, t in enumerate(result):
        writer.writerow([count+1, *t])
    csvfile.close()
    
print(result)