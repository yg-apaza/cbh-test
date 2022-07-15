# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Assumptions

- We are using a SQL Database with the following tables:

```
Facilities
    - facility_id
    - facility_name

Shifts
    - agent_id
    - facility_id
    - total_hours
    - shift_start_time
    - shift_end_time
    - quarter

Agents
    - agent_id
    - agent_name
```

- Only one agent can be assigned to one shift
- Existing features like the following ones are implemented:
    - CRUD for Agent, Shift, Facility tables, and other general user interfaces.
    - We have some sort of admin user that can use a web application to use every feature (generate reports, get shifts by facility).
    - `getShiftsByFacility`: Given the `facility_id`, returns all Shifts worked that quarter including additional metadata about the agent. This is implemented by doing a query to the Shifts table filtering by `facility_id` and using `JOIN` with the Agents table with the `agent_id` to get additional metadata like `agent_name`
    - `generateReport`: Given a list of Shifts, the report shows the hours each Agent worked in a given quarter. This is implemented by doing a query to the Shifts table using `GROUP BY` with `agent_id` and `quarter`, and then using `SUM` for the `total_hours`.


### Tickets to be created

#### Task 1: Apply migrations to the database to include the new Facility Agent table

Time estimate: 1 day

We need to add this new table:

```
Facility Agent
    - agent_id
    - facility_id
    - **agent_external_id**
```

This means that each Agent working at a specific Facility will have their own `agent_external_id`. By default this `agent_external_id` is going to be equal to the `agent_id`.

This task consists of:
- Create the new table and populate it with default values if necessary
- Update the ORM models in our web application

#### Task 2: Ensuring compatibility

Time Estimate: 2 days

Before implementing the following features, we want to make sure that our changes are not going to break the current use of our API.

- Update the `getShiftsByFacility` by adding another `JOIN` with the Facility Agent Table. This will allow us to retrieve the `agent_external_id` metadata. The API endpoint will now return this additional field.
- Update the Frontend to show this additional field.
- Update the unit tests for `getShiftsByFacility`

#### Task 3: As an admin user, I want to be able to assign a custom external id for an Agent working at my facility.

Time estimate: 3 days

This task consists of:
- Backend: Update the API to add a new endpoint `PUT /api/v1/facilityagent`. The user needs to give us the following input:
```
{
    "agent_id": "123456",
    "agent_external_id": "A0001"
}
```
The backend application will make sure to update this to our database table.
- Frontend: Add a new user interface with a list of agents working at that facility. Then add the option to edit the `agent_external_id` for that agent.
- Add new unit tests for this use case

#### Task 4: As an admin user, I want to generate the report showing my custom external id assigned to each agent.

Time estimate: 2 days

This task consists of:
- Backend: We need to modify our query by adding a  `JOIN` to the Facility Agents table so that we are able to get the `agent_external_id`
- Add new unit tests for this use case