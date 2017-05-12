const data = require('./data')

document.addEventListener('dragover',function(event){
	event.preventDefault();
	return false;
});

document.addEventListener('drop',function(event){
	event.preventDefault();
	let file = event.dataTransfer.files[0];
	if (file.type == 'text/tab-separated-values') {
		data.load(file.path);
	}
});
