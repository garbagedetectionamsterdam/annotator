from flask import Flask,flash, request

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
	file_contents = request.stream.read()

	with open("./temp_flask_mock.jpg", "bw") as f:
		f.write(file_contents)

	return """
	<annotation>
		<folder>less_selected</folder>
		<filename>undefined</filename>
		<size>
			<width>undefined</width>
			<height>undefined</height>
		</size>
		<segmented>0</segmented>
		<object>
			<name>Mocked by flask</name>
			<pose>Unspecified</pose>
			<truncated>0</truncated>
			<difficult>0</difficult>
			<bndbox>
				<xmin>100</xmin>
				<ymin>200</ymin>
				<xmax>300</xmax>
				<ymax>400</ymax>
			</bndbox>
		</object>
		<object>
			<name>Mocked2</name>
			<pose>Unspecified</pose>
			<truncated>0</truncated>
			<difficult>0</difficult>
			<bndbox>
				<xmin>400</xmin>
				<ymin>500</ymin>
				<xmax>600</xmax>
				<ymax>700</ymax>
			</bndbox>
		</object>
	</annotation>
	"""
