# UML Class Node

## Constructor

To create a node do the following:

```
Name{
    +attribute: dataType
    -method(): in & return
}
```

- **Name must be unique**
- **A tab must be included before specifying any attributes, methods, or connections**

## Connections

To create a connection on a node do the following:

```
Root{
    --> Target
}

Target{

}
```

This will create an arrowed directed connection from the Root node to the Target node
