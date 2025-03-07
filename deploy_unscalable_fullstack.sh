#! /bin/bash

. ./onetime-setup.sh

[ ! -d "/home/zubhub" ] && { echo >&2 "/home/zubhub dir not available.  Aborting."; exit 1; }
[ ! -d "/home/zubhub_backend" ] && { echo >&2 "/home/zubhub_backend dir not available.  Aborting."; exit 1; }
[ ! -d "/home/zubhub_frontend/zubhub" ] && { echo >&2 "/home/zubhub_frontend/zubhub dir not available.  Aborting."; exit 1; }

echo "copying frontend .env file"
cp /home/zubhub_frontend/zubhub/.env /home/zubhub/zubhub_frontend/zubhub/.env
echo "done copying frontend .env file"

echo "copying backend .env file"
cp /home/zubhub_backend/.env /home/zubhub/zubhub_backend/.env
echo "done copying backend .env file"

echo "copying docker-compose file"
cp /home/zubhub/docker-compose.unscalable.prod.yml /home/docker-compose.unscalable.prod.yml
echo "done copying docker-compose file"

echo "removing old frontend folder"
rm -rf /home/zubhub_frontend
echo "removing old frontend folder"

echo "remove old backend folder"
rm -rf /home/zubhub_backend
echo "removing old backend folder"

echo "copying new frontend folder"
cp -r /home/zubhub/zubhub_frontend/ /home/zubhub_frontend/
echo "done copying new frontend folder"

echo "copying new backend folder"
cp -r /home/zubhub/zubhub_backend/ /home/zubhub_backend/
echo "done copying new backend folder"

# echo "changing permission of cert storage folder if .ssl-data exists"
# [ -d "/home/.ssl-data" ] && sudo chown -R nobody:nogroup /home/.ssl-data/storage
# echo "done changing permission of cert storage folder"

echo "removing uneccessary files and folders"
rm -rf /home/zubhub
rm -rf /home/zubhub_frontend/zubhub/.env.example
rm -rf /home/zubhub_frontend/zubhub/Dockerfile
rm -rf /home/zubhub_frontend/zubhub/docker-compose.yml
rm -rf /home/zubhub_frontend/zubhub/docker-compose.prod.yml
rm -rf /home/zubhub_frontend/zubhub/deploy_frontend.sh
rm -rf /home/zubhub_frontend/zubhub/deploy_frontend.md
rm -rf /home/zubhub_frontend/zubhub/README.md
rm -rf /home/zubhub_frontend/zubhub/nginx/dev
rm -rf /home/zubhub_backend/.env.example
rm -rf /home/zubhub_backend/docker-compose.prod.yml
rm -rf /home/zubhub_backend/docker-compose.yml
rm -rf /home/zubhub_backend/compose/deploy_backend.sh
rm -rf /home/zubhub_backend/compose/deploy_backend.md
echo "done removing uneccessary frontend files and folders"




echo "stopping and rebuilding the containers"
cd /home/
docker-compose -f docker-compose.unscalable.prod.yml --env-file ./zubhub_backend/.env down
sleep 10s
docker-compose -f docker-compose.unscalable.prod.yml --env-file ./zubhub_backend/.env up -d --build
sleep 180s
docker-compose -f docker-compose.unscalable.prod.yml exec web bash  -c "echo 'echo \"from django.contrib.auth \
import get_user_model;User = get_user_model();superusers = User.objects.filter(is_superuser=True);\
user = User.objects.create_superuser(\\\"dummy\\\", \\\"dummy@mail.com\\\", \\\"dummy_password\\\") \
if superusers.count() == 0 else superusers.none(); \
hasattr(user, \\\"is_staff\\\") and setattr(user, \\\"is_staff\\\", True); \
user and user.save(); \
print(\\\"new super user created successfully\\\") if hasattr(user, \\\"is_staff\\\") \
else print(\\\"superuser already exists\\\");\" | python /zubhub_backend/zubhub/manage.py shell' > /dummy.sh"

docker-compose -f docker-compose.unscalable.prod.yml exec web bash /dummy.sh
docker-compose -f docker-compose.unscalable.prod.yml exec web bash -c "rm /dummy.sh"
echo "Updated fullstack"
# EOT

