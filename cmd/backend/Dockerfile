# Define a build-time variable for the app name
ARG APP_NAME=backend

# Start from golang base image
FROM --platform=$BUILDPLATFORM golang:1.19-alpine AS builder
# Set the current working directory inside the container
WORKDIR /build
ENV GOOS linux
ENV CGO_ENABLED 0
ENV GOPATH /go
ENV GOCACHE /go-build
# Copy go.mod, go.sum files and download deps
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod/cache go mod download
COPY . .
# Build the Go app using the APP_NAME variable
RUN --mount=type=cache,target=/go/pkg/mod/cache \
    --mount=type=cache,target=/go-build \
    go build -o $APP_NAME ./cmd/$APP_NAME

# Start a new stage from alpine
FROM alpine:3.17.2 as final
RUN apk --no-cache add tzdata
WORKDIR /dist
# Copy the build artifacts from the previous stage using the APP_NAME variable
COPY --from=builder /build/$APP_NAME .
CMD ["/dist/$APP_NAME"]
