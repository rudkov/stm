## Installation on a Clean MacOS

### Dependencies:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
- [VSCode](https://code.visualstudio.com/)
- [Homebrew](https://brew.sh/)

### Next Steps
```bash
brew install php
```
```bash
brew install composer
```
```bash
brew install npm
```

Add this to ```~/.zshrc```:
```bash
alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'
```
Reload the terminal window.

### In the ```back``` Folder
```bash
composer update
```

## Running on Development
Run a project:
```
sail up -d
```

Completely re-build the database:
```
sail php artisan migrate:fresh --seed
```

### Other Useful Commands
Run unit tests:
```
php artisan test
```