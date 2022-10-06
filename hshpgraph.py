from lxml import etree

# tree = etree.parse("./data/PriestWinT5.xml")
tree = etree.parse("./data/BeastHunterWin_annotated.xml") # https://hsreplay.net/replay/LQ2unSYf7w7hLfBu5Foa6U
# tree = etree.parse("./data/BeastHunterWin2_annotated.xml") # https://hsreplay.net/replay/gRfknupKptbsozKXa7DnZk
# tree = etree.parse("./data/Healfest_annotated.xml") # priest healfest
# tree = etree.parse("./data/Armorfest_annotated.xml") # warrior armorfest

players = tree.xpath('//Player')
damages = tree.xpath('//Block//MetaData[@MetaName="DAMAGE"]')

# set up player dicts
player1 = {}
player2 = {}

player1['id'] = players[0].xpath('Tag[@tag="53"]')[0].get("value") # either 2 or 3
player1['name'] = players[0].get('name').split('#')[0]
player1['entityid'] = players[0].xpath('Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value') # TODO: Handle changes e.g. when Hero Cards are played
player1['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player1['entityid'] + '"]/parent::* ')[0].get('EntityName')
player1['damaged'] = 0
player1['healed'] = 0
player1['armor'] = 0
# TODO: handle Renethal

player2['id'] = players[1].xpath('Tag[@tag="53"]')[0].get("value")
player2['name'] = players[1].get('name').split('#')[0]
player2['entityid'] = players[1].xpath('Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value')
player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')
player2['damaged'] = 0
player2['healed'] = 0
player2['armor'] = 0

dmg_amounts = [d.get('data') for d in damages]
dmg_target_entities = [d.getchildren()[0].get('entity') for d in damages]
dmg_target_names = [d.getchildren()[0].get('EntityName') for d in damages]
dmg_zip = list(zip(dmg_amounts, dmg_target_entities, dmg_target_names))

print('Players:\n', player1, '\n', player2)

# from tree, get these events: next turn | damage | healing | armour | hero card
# Next turn:
# <TagChange entity="1" tag="20" value="1" EntityCardID="GameEntity" EntityCardName="GameEntity" GameTagName="TURN"/>
#
# Damage:
# <TagChange entity="39" tag="44" value="1" EntityCardID="SW_319" EntityCardName="Peasant" GameTagName="DAMAGE"/>
#
# Healing:
# <MetaData meta="2" data="6" infoCount="1" MetaName="HEALING"> 
#   <Info index="0" entity="18" EntityName="Kurtrus, Demon-Render"/> 
# </MetaData>
#
# Armour:
# <TagChange entity="18" tag="292" value="4" EntityCardID="AV_204" EntityCardName="Kurtrus, Demon-Render" GameTagName="ARMOR"/>
#
# Hero card:
# <ShowEntity entity="18" cardID="AV_204" EntityName="Kurtrus, Demon-Render"> 
#   <Tag tag="202" value="3" GameTagName="CARDTYPE"/>
#   <Tag tag="53" value="18" GameTagName="ENTITY_ID"/>
#   <Tag tag="292" value="5" GameTagName="ARMOR"/> 
# </ShowEntity>

turns = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"] | //Block//TagChange[@tag="44"] | //Block//MetaData[@meta="2"] | //Block//TagChange[@tag="292"] | //Block[@type="7"]//Tag[@tag="202"][@value="3"]/ancestor::ShowEntity')
currentturn = 1

for turn in turns:
    # print(turn.items()) # debug
    if turn.get('tag') == '20':                 # next turn
        currentturn += 1
        print('End of turn HP:')
        p1hp = 30 - int(player1["damaged"]) + int(player1["healed"])
        p2hp = 30 - int(player2["damaged"]) + int(player2["healed"])
        print(f'{player1["hero"]}: {p1hp} ')
        print(f'{player2["hero"]}: {p2hp} ')
        print(f'\nTurn {int(currentturn/2)}')
    
    targetid = turn.get('entity')
    if turn.get('tag') == '44':                 # target receives damage
        if targetid != player1['entityid'] and targetid != player2['entityid']:   # only use this data if it damages either hero; skip everything else
            continue
        targetname = turn.get('EntityCardName')
        dmg = turn.get('value')
        if dmg == '0':
            continue
        if targetid == player1['entityid']:     # keep track of player's HP
            player1['damaged'] = int(dmg)
        elif targetid == player2['entityid']:
            player2['damaged'] = int(dmg)
        print(f'{targetname} (ID: {targetid}) has received {dmg} damage')
        
    if turn.get('meta') == '2':                 # heals target
        targetid = turn.getchildren()[0].get('entity')
        targetname = turn.getchildren()[0].get('EntityName')
        heal = turn.get('data')
        if targetid == player1['entityid']:     # keep track of healing so far
            player1['healed'] += int(heal)
        elif targetid == player2['entityid']:
            player2['healed'] += int(heal)
        else:
            continue
        print(f'{targetname} (ID: {targetid}) was healed for {heal}')
            
    if turn.get('tag') == '292':                # change armor
        target = turn.get('entity')
        armor = turn.get('value')
        print(f'Entity {target} now has {armor} armor')
        
# outcome = tree.xpath('//TagChange[@tag="17"][@value="4"]|//TagChange[@tag="17"][@value="5"]')
winner = tree.xpath('//TagChange[@tag="17"][@value="4"]')[0]
print(f"\nThe winner was {winner.get('EntityCardID').split('#')[0]}")