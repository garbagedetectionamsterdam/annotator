var config = require('./config')
var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser');
var app = express()
var xml2js = require('xml2js')
var sizeOf = require('image-size');

var port = 5555

app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/image', express.static(config.imagePath))
app.use(bodyParser.json());

var assignedImages = [];
function pickNewImage()
{
	var allImages = fs.readdirSync(config.imagePath).filter(x => x.endsWith('.jpg')).map(x => x.slice(0, -4))
	var allAnnotations = fs.readdirSync(config.annotationPath).filter(x => x.endsWith('.xml')).map(x => x.slice(0, -4))

	var pickableImages = allImages.filter(x => !allAnnotations.includes(x) && !assignedImages.includes(x))

	var targetImage = pickableImages[Math.floor(Math.random() * pickableImages.length)];

	assignedImages.push(targetImage)

	return targetImage
}


function buildObjectXML(data)
{
	var tagName = data.name;
	var xmin = Math.min(data.bounds[0][0], data.bounds[1][0])
	var ymin = Math.min(data.bounds[0][1], data.bounds[1][1])
	var xmax = Math.max(data.bounds[0][0], data.bounds[1][0])
	var ymax = Math.max(data.bounds[0][1], data.bounds[1][1])

	// the indenting is necessary to make the output file look ok
	var objectTemplate =
`	<object>
		<name>${tagName}</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>${xmin}</xmin>
			<ymin>${ymin}</ymin>
			<xmax>${xmax}</xmax>
			<ymax>${ymax}</ymax>
		</bndbox>
	</object>`;

	return objectTemplate;
}

function buildAnnotationXML(data)
{
	var filename = data.fileBase + '.jpg'
	var dimensions = sizeOf(config.imagePath + '/' + filename);
	var width = dimensions.width
	var height = dimensions.height

	var objects = data.objects.map(x => buildObjectXML(x)).reduce((acc, x) => acc + ' ' + x, '')

	// the indenting is necessary to make the file look OK
	var containerTemplate =
`
<annotation>
	<folder>less_selected</folder>
	<filename>${filename}</filename>
	<size>
		<width>${width}</width>
		<height>${height}</height>
	</size>
	<segmented>0</segmented>
${objects}

</annotation>`

	return containerTemplate
}

function storeAnnotation(data)
{
	var filePath = config.annotationPath + '/' + data.fileBase + '.xml'
	var fileContents = buildAnnotationXML(data)

	console.dir(filePath)
	console.dir(fileContents)

	fs.writeFileSync(filePath, fileContents)
}

function getTags()
{
	var tagFileContents = '' + fs.readFileSync(config.tagFilePath).toString()
	console.log(tagFileContents)
	var regex = /item\s*{\s*id:\s*\d+\s*name:\s'([A-Za-z_\s]+)'\s*}\s*/gm

	var tags = [];
  	var match;
  	while (match = regex.exec(tagFileContents)) {

    		tags.push(match[1]);
  	}

  	return tags
}


function loadBoxesFromAnnotation(fileBase, callback)
{
	var filePath = config.annotationPath + fileBase + '.xml'

	if (!fs.existsSync(filePath)) {
		callback([])
		return
	};

	var fileContents = fs.readFileSync(filePath)

	xml2js.parseString(fileContents, (err, parsedContents) => {
		callback(parsedAnnotationToBoxes(parsedContents))
	})
}

function parsedAnnotationToBoxes(parsedContents)
{
	var boxes = [];

	var parsedBoxes = parsedContents.annotation.object;
	if(!parsedBoxes) return boxes;

	for(var i in parsedBoxes)
	{
		var bnds = parsedBoxes[i].bndbox[0]
		boxes.push({
			name: parsedBoxes[i].name[0],
			bounds: [
				[parseFloat(bnds.xmin[0]), parseFloat(bnds.ymin[0])],
				[parseFloat(bnds.xmax[0]), parseFloat(bnds.ymax[0])]
			]
		})
	}

	return boxes
}


app.post('/annotation', function(req, res) {
  console.log("Annotation")

  console.dir(req.body)
  if(req.body.annotation)
  {
  	console.log("storing")

  	storeAnnotation(req.body.annotation)
  	res.send(JSON.stringify({isSuccessful: true}))
  	return
  }

  res.send(JSON.stringify({isSuccessful: false}))

})

app.get('/', function (req, res) {

  console.log('handling request')

  if(!req.query.imageSource) {
  	res.redirect('?imageSource=' + pickNewImage())
  	return;
  }

  loadBoxesFromAnnotation(req.query.imageSource, function(boxes) {
	res.render('index', {
		imageSource: req.query.imageSource,
		tags: getTags(),
		boxes: boxes
	})
  })
})


app.listen(port, () => console.log(`Annotation app listening on port ${port}!`))
