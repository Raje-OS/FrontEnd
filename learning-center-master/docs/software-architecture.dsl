workspace "Learning Center - Angular/Spring Boot Stack Edition" "Software architecture diagrams for the Learning Center application" {

  model {
    # People
    admin = person "Course Administrator" "A person who manages and maintains course content"
    student = person "Student" "A person who views and enrolls in courses"

    # Software System
    learningCenter = softwareSystem "Learning Center" "Allows administrators to manage online courses and students to view course offerings" {
      # Containers
      webApplication = container "Web Application" "Delivers the static content and the Learning Center single page application" "Angular, TypeScript" "webapp"

      singlePageApplication = container "Single Page Application" "Provides all course management functionality to administrators and students via their web browser" "TypeScript, Angular, NGX-Translate, Angular Material" "spa" {
        tags "Web Browser"
      }

      apiApplication = container "API Application" "Provides course management functionality via RESTful API" "Spring Boot, Java" "api" {
        tags "API"
      }

      database = container "Database" "Stores course information, categories, and metadata" "MySQL Server" "database" {
        tags "Database"
      }
    }

    # Relationships between people and system
    admin -> learningCenter "Manages courses using"
    student -> learningCenter "Views and searches courses using"

    # Relationships between containers
    admin -> webApplication "Visits learning-center.com using" "HTTPS"
    student -> webApplication "Visits learning-center.com using" "HTTPS"

    webApplication -> singlePageApplication "Delivers to the customer's web browser"

    singlePageApplication -> apiApplication "Makes API calls to" "JSON/HTTPS" "REST API"

    apiApplication -> database "Reads from and writes to" "Spring Data JPA"
  }

  views {
    systemContext learningCenter "SystemContext" "The system context diagram for the Learning Center" {
      include *
      autoLayout lr
    }

    container learningCenter "Containers" "The container diagram for the Learning Center" {
      include *
      autoLayout lr
    }

    styles {
      element "Person" {
        shape "Person"
        background "#08427b"
        color "#ffffff"
      }
      element "Software System" {
        background "#1168bd"
        color "#ffffff"
      }
      element "Container" {
        background "#438dd5"
        color "#ffffff"
      }
      element "Web Browser" {
        shape "WebBrowser"
        background "#438dd5"
        color "#ffffff"
      }
      element "API" {
        background "#438dd5"
        color "#ffffff"
      }
      element "Database" {
        shape "Cylinder"
        background "#438dd5"
        color "#ffffff"
      }
    }

    theme default
  }

  properties {
    structurizr.groupSeparator "/"
  }
}
