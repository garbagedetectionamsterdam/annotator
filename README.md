# README

## Configuring the code

The code is configured in config.js. This file is not in the repository. There are however default development and production config.js files that can be found in configProduction.js and configDevelopment.js. Just copy the one you wish to use to config.js

module.exports = {
	tagFilePath: 'the filepath to label_map.pbtxt containing the labels',
	imagePath: 'the path to the folder containing all images',
	annotationPath: 'the path to the annotation xmls corresponding to the images',
	predictionApi: 'the url to retrieve predictions from (in xml format)',
	port: 80 the portnumber
}


## Running the code

```
node app.js
```

## Running the code with docker
```
./startDocker.sh
```

## Building the docker container
```
./buildDocker.sh
```

## Manual


### Creating, manipulating and deleting bounding boxes

- Drag on the image to create a new box. It gets the tag selected in the tag dropdown.
- Drag a white squares on the outline to resize the bounding box
- Drag the center of a bounding box to move it
- Click the cross in the top right to delete the bounding box

### Assigning tags

- Click a bounding box to select it. The outline becomes blue when it is selected
- Click set tag to set the selected tag
- Change the selected tag in the dropdown to assign a different tag
- Press w or s to change the selected tag.

### Submitting/navigating the image history

- Press next image or previous image to go the next or previous image. This automatically submits the image
- You can also press A for previous image or D for next image.

### Assistive prediction

When a new image is annotated it is possible that the half trained neural network has predictions to assist the annotator. These predictions are presented with a red outline.

The annotator must either accept, modify or reject the prediction.

- Press accept predictions to accept all predictions.
- Modifying a prediction accepts it, as shown by the prediction outline changing color.
- Press reject predictions to remove all predictions.

- Check "accept predictions by default?" to automatically accept all unmodified predictions on submission.
- Uncheck it to automatically reject all unmodified predictions on submission


### The meaning of the labels

I think you Mark or Maarten are better qualified to define the labels and pick the correct images. This is the contents of the labelpb.txt ordered in the frequency I expect at least one item will occur in the images:

```
item {
  id: 1
  name: 'small_container'
}

item {
  id: 2
  name: 'big_container'
}

item {
  id: 3
  name: 'trash_bag'
}

item {
  id: 4
  name: 'grocery_bag'
}

item {
  id: 5
  name: 'cardboard_flat'
}

item {
  id: 6
  name: 'cardboard_box_filled'
}

item {
  id: 7
  name: 'suitcase'
}

item {
  id: 8
  name: 'couch'
}

item {
  id: 9
  name: 'wood'
}

item {
  id: 10
  name: 'carpet'
}

item {
  id: 11
  name: 'chair'
}

item {
  id: 12
  name: 'refrigerator'
}

item {
  id: 13
  name: 'matras'
}

item {
  id: 14
  name: 'shopping_cart'
}

item {
  id: 15
  name: 'trashbin'
}

```

