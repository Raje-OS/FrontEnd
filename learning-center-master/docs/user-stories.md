# Learning Center User Stories

## Course Management

### US001: Course Listing
**As a** course administrator,  
**I want to** view a list of all available courses,  
**So that** I can manage the course catalog effectively

#### Acceptance Criteria:

##### Scenario 1: View All Courses
**Given** the administrator has access to the system,  
**When** the administrator requests to view all courses  
**Then** the system displays a list of all available courses  
**And** each course shows its ID, title and description

##### Scenario 2: Sort Courses
**Given** the administrator views the course list  
**When** the administrator requests to sort by any course field  
**Then** the system reorders the list according to the selected field.

### US002: Course Creation
**As a** course administrator,  
**I want to** create new courses,  
**So that** I can expand the course offerings

#### Acceptance Criteria:

##### Scenario 1: Create valid Course
**Given** the administrator has course creation access  
**When** they submit valid course title and description,  
**Then** the system creates a new course with a unique identifier   
**And** adds the course to the catalog  
**And** confirms successful creation  

##### Scenario 2: Prevent Duplicate Course
**Given** a course with the title "JavaScript Basics" exists  
**When** the administrator attempts to create another course with the same title,   
**Then** the system prevents the creation  
**And** indicates the course title already exists  

### US003: Course Modification
**As a** course administrator,  
**I want to** modify existing courses,  
**So that** I can keep course information up to date.

#### Acceptance Criteria:

##### Scenario 1: Update Course Information
**Given** a course exists in the system   
**When** the administrator modifies the course description  
**Then** the system updates the course information  
**And** maintains the original course identifier  
**And** confirms a successful update

##### Scenario 2: Cancel Course Update
**Given** the administrator is updating a course  
**When** they cancel the modification process  
**Then** the system retains the original course information  
**And** returns to the course listing state  

### US004: Course Deletion
**As a** course administrator,  
**I want to** remove outdated courses,  
**So that** I can maintain an accurate course catalog.

#### Acceptance Criteria:

##### Scenario 1: Delete Course
**Given** an existing course in the system  
**When** the administrator confirms course deletion,   
**Then** the system removes the course from the catalog  
**And** confirms successful deletion

##### Scenario 2: Delete Course with Enrollments
**Given** a course has active enrollments  
**When** the administrator attempts to delete the course,  
**And** the system verifies the course has active enrollments  
**Then** the system prevents the deletion  
**And** indicates the course has active enrollments   




