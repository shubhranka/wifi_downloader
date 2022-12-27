
## Installation

### Install Termux
```bash
  install termux from f-droid
```

### Installing NodeJs in termux
```
    apt-get update && apt-get upgrade
    apt install nodejs
```

### Create storage
```
    termux-setup-storage
```
    
### Clone the app and run
```
    git clone https://github.com/shubhranka/wifi_downloader.git
    cd wifi_downloader
    npm install
```

### Run using
```
    node app.js
```

### Default port is 3000 - to change add manual port
```
    node app.js 3001
```

## Output
```
    Server started at http://<ip_address>:<port>
    
    <!-- Copy this link to open the download explorer -->
```

# App coming soon