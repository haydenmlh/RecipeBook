#frontend startup
cd frontend
npm install
cd ..
#backend startup
python3.10 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
python3.10 backend/p2/manage.py makemigrations
python3.10 backend/p2/manage.py migrate
