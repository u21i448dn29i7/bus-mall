# User Stories

## The marketing research team

1. As a marketing research team, we want a simple, cleanly designed single page application with no headers, boarders or styling to distract the user from their selection process.
1. As a marketing research team, we should be able to launch the site on a 9.7" iPad and enter a "full screen" landscape mode, then hand the appliance to the participant to complete the survey. We should be able to start the survey for the user, then when the user is finished we should be able to enter "report mode" to view the results. 
1. As a marketing research team, we should be able to identify the user by a unique, anonymous ID, the date and time of the survey was completed. We will not collect any PII from the participant.
1. As a marketing research team, we should be able to restart the survey without a loss of data.

## The focus group participant

1. As a focus group participant, I want to select my preference of three images with a single click or touch, and then  then have the page automatically cylcle the next set of images.

## The developer

1. As a developer I want the app to work flawlessly, on any landscape device similar to the 9.7" iPad, equiv, or larger, manufactured between 2016 and 2018. Same for browsers. No old, crappy browser support.
1. As a developer create a three "slide" application that does not ever reload the page. prestartSectionId, Survey Reports should all be presented by using display:none or proper display to 'hide/unhide'.
1. As a developer, I'll use normalize.css rather than reset.css to ensure better browser support.
1. STRETCH: As a developer I want the application to be a single page web app, served from an S3 bucket, authenticated with AWS Cognito (for the researchers), and all data stored in the Dynamo.
