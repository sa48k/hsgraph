from lxml import etree

tree = etree.parse("./data/PriestWinT5.xml")
damages = tree.xpath('//Block//MetaData[@MetaName="DAMAGE"]')

for d in damages:
	print(d.items())
	print(d.getchildren()[0].items())
	# print('\n')
