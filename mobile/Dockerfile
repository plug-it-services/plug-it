FROM cirrusci/flutter:stable

WORKDIR "/build"
COPY . .

RUN flutter pub get
RUN flutter build apk --release --no-sound-null-safety

CMD ["cp", "/build/build/app/outputs/flutter-apk/app-release.apk", "/app/client.apk"]