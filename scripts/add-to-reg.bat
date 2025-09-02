@echo on
setlocal enabledelayedexpansion

:: Usage: push_image.cmd mytag
:: If no argument is given, defaults to "latest"

set TAG=%1
if "%TAG%"=="" (
    set TAG=latest
)

:: Configurable vars
set IMAGE_NAME=mbhs-website-image
set PROJECT_ID=mbhs-hackathon-db
set REGION=us-east4
set REPO=docker-image-repo
set LOCALTAG=latest

:: Full image path
set FULL_IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/%REPO%/%IMAGE_NAME%:%TAG%

echo Tagging image as: %FULL_IMAGE%

docker build -t %IMAGE_NAME%:%TAG% .

docker tag %IMAGE_NAME%:%LOCALTAG% %FULL_IMAGE%
docker push %FULL_IMAGE%

gcloud run deploy official-mbhs-hackathon-host --image %FULL_IMAGE% --region %REGION% --platform managed

endlocal
