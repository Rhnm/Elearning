# Elearning Django Project

Welcome to Elearning Django project! This repository contains the code for elearning web application built using Django. Below are the installation instructions to get started.

## Installation

### 1. Prerequisites

a. Install python
b. Install python extention for VSCode.
c. Create a project directory name it Elearning

```bash
cd Elearning
```

### 2. Create Virtual Enviornment

# How to install virtualenv:

### Install **pip** first

    sudo apt-get install python3-pip

### Then install **virtualenv** using pip3

    sudo pip3 install virtualenv 

### Now create a virtual environment 

    virtualenv venv 

>you can use any name insted of **venv**

### You can also use a Python interpreter of your choice

    virtualenv -p /usr/bin/python2.7 venv
  
### Active your virtual environment:    
    
    source venv/bin/activate
    
### Using fish shell:    
    
    source venv/bin/activate.fish

### To deactivate:

    deactivate

### Create virtualenv using Python3
    virtualenv -p python3 myenv

### Instead of using virtualenv you can use this command in Python3
    python3 -m venv myenv


a. Create Enviornment

```bash
python -m  venv proj_env
```

b. Activate Enviornment

__For Windows

```bash
./proj_env/Scripts/activate
```

If the above shows error on Win11 then run powershell in admin mode and run the following code:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

**
Now it should work
**

__
For Linux/MacOS
__

```bash
source proj_env/bin/activate
```

### 3. Install Django: Once virtual enviornment is active

```bash
python -m pip install django
```

### 4. Create a django Project

```bash
django-admin startproject elearn
```

### 5. Run initial migrations

```bash
python manage.py migrate
```

this creates all the admin, session etc... files and sqlite file

### 6. Start the development server

```bash
python manage.py runserver
```

### 7. Create a django app

```bash
python manage.py startapp elearnapp
```

this creates files like admin.py, apps.py, models.py, tests.py, views.py


# Create a React Frontend

```bash
npx create-react-app elearn-frontend
cd elearn-frontend
```



