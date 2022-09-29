from lxml import etree

tree = etree.parse("./data/PriestWinT5.xml")

players = tree.xpath('//Player')
damages = tree.xpath('//Block//MetaData[@MetaName="DAMAGE"]')

player1 = {}
player2 = {}

player1['id'] = players[0].get('playerID')
player1['name'] = players[0].get('name').split('#')[0]
player1['entityid'] = players[0].xpath('//Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value')
player1['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player1['entityid'] + '"]/parent::* ')[0].get('EntityName')

player2['id'] = players[1].get('playerID')
player2['name'] = players[1].get('name').split('#')[0]
player2['entityid'] = players[1].xpath('Tag[@GameTagName = "HERO_ENTITY"] ')[0].get('value')
player2['hero'] = tree.xpath('//FullEntity//Tag[@value="' + player2['entityid'] + '"]/parent::* ')[0].get('EntityName')

# We can retrieve the Hero's damage so far using:
# <TagChange entity="64" tag="44" value="23" EntityCardID="HERO_09b" EntityCardName="Madame Lazul" GameTagName="DAMAGE"/>
#     Hero entity id /	    damage taken /

healthtree1 = tree.xpath('//TagChange[@entity="' + player1['entityid'] + '"][@tag="44"]  ') 
print(healthtree1)
player1['health'] = [d.get('value') for d in healthtree1]
healthtree2 = tree.xpath('//TagChange[@entity="' + player2['entityid'] + '"][@tag="44"]') 
player2['health'] = [d.get('value') for d in healthtree2]

print('Players:\n', player1, player2, '\n')
