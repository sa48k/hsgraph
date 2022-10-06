from lxml import etree

tree = etree.parse("./data/PriestWinT5.xml")
# tree = etree.parse("./data/BeastHunterWin_annotated.xml") # https://hsreplay.net/replay/LQ2unSYf7w7hLfBu5Foa6U
# tree = etree.parse("./data/BeastHunterWin2_annotated.xml") # https://hsreplay.net/replay/gRfknupKptbsozKXa7DnZk
# tree = etree.parse("./data/Healfest_annotated.xml") # priest healfest
tree = etree.parse("./data/Armorfest_annotated.xml") # warrior armorfest

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
player1['armor'] = 0

dmg_amounts = [d.get('data') for d in damages]
dmg_target_entities = [d.getchildren()[0].get('entity') for d in damages]
dmg_target_names = [d.getchildren()[0].get('EntityName') for d in damages]
dmg_zip = list(zip(dmg_amounts, dmg_target_entities, dmg_target_names))

# healthtree1 = tree.xpath('//TagChange[@entity="' + player1['entityid'] + '"][@tag="44"]  ') 
# player1['health'] = [d.get('value') for d in healthtree1]
# healthtree2 = tree.xpath('//TagChange[@entity="' + player2['entityid'] + '"][@tag="44"]') 
# player2['health'] = [d.get('value') for d in healthtree2]

print('Players:\n', player1, '\n', player2)

# change of turn looks like this:
# <TagChange entity="1" tag="20" value="19" EntityCardID="GameEntity" EntityCardName="GameEntity" GameTagName="TURN"/>
#                             19th turn /   (both players take turns, so this is T10 in-game)

# from tree, get these events: next turn | damage | healing | armour
turns = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"] | //Block//TagChange[@tag="44"] | //Block//TagChange[@tag="425"] | //Block//TagChange[@tag="292"]')
currentturn = 1

for turn in turns:
    if turn.get('tag') == '20':                 # next turn
        currentturn += 1
        # print(f"{player1['hero']}: received {player1['damaged']} damage")
        # print(f"{player2['hero']}: received {player2['damaged']} damage")
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
        # print(turn.items())
        
    if turn.get('tag') == '425':                 # heals target
        targetname = turn.get('EntityCardName')
        heal = turn.get('value')
        if heal == '0':
            continue
        if targetid == player1['entityid']:     # keep track of healing so far
            player1['healed'] += int(heal)      # BUG: allows for 'overhealing'. Use <MetaData> to fix?
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