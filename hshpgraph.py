from lxml import etree

# tree = etree.parse("./data/PriestWinT5.xml")
# tree = etree.parse("./data/BeastHunterWin_annotated.xml")
tree = etree.parse("./data/BeastHunterWin2_annotated.xml") # https://hsreplay.net/replay/gRfknupKptbsozKXa7DnZk

players = tree.xpath('//Player')
damages = tree.xpath('//Block//MetaData[@MetaName="DAMAGE"]')

player1 = {}
player2 = {}

player1['id'] = players[0].get('playerID')
player1['name'] = players[0].get('name').split('#')[0]
player1['entityid'] = players[0].xpath('//Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value') # TODO: This changes e.g. when Hero Cards are played
player1['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player1['entityid'] + '"]/parent::* ')[0].get('EntityName')

player2['id'] = players[1].get('playerID')
player2['name'] = players[1].get('name').split('#')[0]
player2['entityid'] = players[1].xpath('Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value')
player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')

dmg_amounts = [d.get('data') for d in damages]
dmg_target_entities = [d.getchildren()[0].get('entity') for d in damages]
dmg_target_names = [d.getchildren()[0].get('EntityName') for d in damages]
dmg_zip = list(zip(dmg_amounts, dmg_target_entities, dmg_target_names))

print('Damages that occurred in this match (dmg amount, target entityid, target name):\n')
      
for d in dmg_zip:
    print(d)

# We can retrieve the Hero's damage (maybe) using:
# <TagChange entity="64" tag="44" value="23" EntityCardID="HERO_09b" EntityCardName="Madame Lazul" GameTagName="DAMAGE"/>
#     Hero entity id /	    damage taken /

healthtree1 = tree.xpath('//TagChange[@entity="' + player1['entityid'] + '"][@tag="44"]  ') 
player1['health'] = [d.get('value') for d in healthtree1]
healthtree2 = tree.xpath('//TagChange[@entity="' + player2['entityid'] + '"][@tag="44"]') 
player2['health'] = [d.get('value') for d in healthtree2]

print('Players:\n', player1, '\n', player2)

# TODO: A better way might be to iterate over each turn, then calculate each Hero's health at the end of that turn