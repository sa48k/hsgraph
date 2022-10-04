from lxml import etree

tree = etree.parse("./data/PriestWinT5.xml")
# tree = etree.parse("./data/BeastHunterWin_annotated.xml") # https://hsreplay.net/replay/LQ2unSYf7w7hLfBu5Foa6U
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
player1['hp'] = 30
# TODO: handle Renethal

player2['id'] = players[1].xpath('Tag[@tag="53"]')[0].get("value")
player2['name'] = players[1].get('name').split('#')[0]
player2['entityid'] = players[1].xpath('Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value')
player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')
player2['hp'] = 30 

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

turns = tree.xpath('//Block//TagChange[@entity="1"][@tag="20"]|//Block//MetaData[@MetaName="DAMAGE"]|//Block//MetaData[@MetaName="HEALING"]|//Block//TagChange[@tag="292"]')
currentturn = 1

for turn in turns:
    if turn.get('GameTagName'):  # next turn
        currentturn += 1         # TODO: find a more reliable way to do this, preferably just using Tag/Entity/Value attributes; the real XML won't have these annotations
        print(f"{player1['hero']}: {player1['hp']} HP")
        print(f"{player2['hero']}: {player2['hp']} HP")
        print(f'\nTurn {int(currentturn/2)}')
        
    if turn.get('meta') == '1':     # damages target
        targetid = turn.getchildren()[0].get('entity')
        targetname = turn.getchildren()[0].get('EntityName')
        dmg = turn.get('data')
        if targetid == player1['entityid']:     # keep track of player's HP
            player1['hp'] -= int(dmg)
        elif targetid == player2['entityid']:
            player2['hp'] -= int(dmg)
        
           
        print(f'{dmg} damage to {targetname}')
        # print(turn.items())
        # print(turn.getchildren()[0].items())
    if turn.get('meta') == '2':     # heals target
        target = turn.getchildren()[0].get('EntityName') # DRY
        dmg = turn.get('data')
        print(f'{dmg} healing to {target}')
    if turn.get('tag') == '292':    # change armor
        armor = turn.get('value')
        target = turn.get('entity')
        print(f'Entity {target} now has {armor} armor')
        
    
            
# outcome = tree.xpath('//TagChange[@tag="17"][@value="4"]|//TagChange[@tag="17"][@value="5"]')
winner = tree.xpath('//TagChange[@tag="17"][@value="4"]')[0]
print(f"\nThe winner was {winner.get('EntityCardID').split('#')[0]}")

# dealing with armor
# <TagChange entity="74" tag="292" value="29" EntityCardID="HERO_01" EntityCardName="Garrosh Hellscream" GameTagName="ARMOR"/>
#             player /    amount of armor /