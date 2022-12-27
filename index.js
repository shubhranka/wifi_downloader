const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
var Archiver = require('archiver');
let curPath = __dirname;

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use public static files
app.use(express.static('public'));

// Current directory
const path = require('path');

// Use pug
app.set('view engine', 'pug');


app.get('/go/base', (req, res) => {

    // Back to the base directory
    curPath = __dirname

    // Redirect to the base directory
    return res.redirect('/');
});
app.get('/go/back', (req, res) => {

    try{

        // Back to the parent directory
        const newpath = path.resolve(curPath, '..');
        
        // Check if allowed directory
        fs.accessSync(newpath, fs.constants.R_OK)
        
        // Update the currpath
        curPath = newpath

        // Redirect to the base directory
        return res.redirect('/');
        
    }catch(err){
        next(err)
    }
        
    });


app.post('/', (req, res) => {
    
    try{

        // Get the name of the file
        const name = req.body.name;
        
        // Generate the path
        const newpath = path.join(curPath, name);
        
        // Check if file
        if (fs
            .lstatSync(newpath)
            .isFile()) {
                return res.download(newpath);
        }
        
        // Update the current path
        curPath = newpath;

        return res.redirect('/');
    }catch(err){
        next(err)
    }
    
});

app.post('/search',(req,res)=>{

    try{

        // Get the path to search
        const search_path = req.body.search_path;
        
        // Generate the path
        const newpath = path.join(search_path);
        
        // Check if file path exists
        if(!fs.existsSync(newpath)){
            throw new Error("Path does not exist");
        }

        // Check if file or allowed directory
        fs.accessSync(newpath, fs.constants.R_OK)
        
        // // If file, then download
        if (fsstat.isFile()){
            return res.download(newpath);
        }

        // If directory, then update the current path
        curPath = newpath;
        
        // Redirect to the base directory
        return res.redirect('/');
        
    }catch(err){
        next(err)
    }
})
    

app.get('/', (req, res,next) => {

    try{

        // Get names of files in the directory
        const files = fs.readdirSync(curPath);
        const files_with_type = files.map(file => {
            const file_type = fs.lstatSync(path.join(curPath)).isDirectory() ? "folder" : "file";
            return {
                name: file,
                type: file_type
            }
        });
    
        // Render
        return res.render("files_folders",{files:files_with_type,path:curPath});
    }
    catch(err){
        return err;
    }
});

app.use((error,req,res,next)=>{


    // Redirect to the base directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(curPath)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    });

    // Render
    return res.render("files_folders",{files:files_with_type,path:curPath});

})

const port = process.argv[2] || 3000;

app.get("/download",(req,res)=>{    
    
    // Create zip
    const zip = Archiver('zip');

    // Attach zip to response
    zip.pipe(res);

    // Add files to zip
    zip.directory(curPath, false);

    // Finalize zip
    zip.finalize();

    // Send zip
    res.attachment('folder.zip');

})
app.listen(port, () => {
    const ipaddress = require('ip').address();
    console.log(`Server started at http://${ipaddress}:${port}`);
});