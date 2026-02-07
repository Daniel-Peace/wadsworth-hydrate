echo "Building docker image"
cd ../wadsworth-hydrate-bot/
sudo docker build -t wadsworth-hydrate-image -f ../docker/Dockerfile .
