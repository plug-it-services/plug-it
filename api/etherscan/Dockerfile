FROM gin:lts-alpine

# Install the app
COPY . /app
WORKDIR /app
RUN go build -o /app/main

# Run the app
CMD ["/app/main"]