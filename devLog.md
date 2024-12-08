## 11/30 Smart Zooming
Default zoom behaviour is to zoom to origin (0,0)
set zoom to middle of screen by taking the proportion of distance between the old zoom area and new and shifting everything over
Added offset based upon cursor location on screen
offset is a constant standard so must convert to that

## 12/2 Select Mode

Bigger Problem - What data structure to use to store nodes

Need to access quickly and update quickly
Does not have linear relationship to other nodes
Connections between nodes will be stored on the nodes themselves

Could store in a map

When saving to a database, Should be able to convert to json

started setting up local mongoDB server
installed docker

## 12/3