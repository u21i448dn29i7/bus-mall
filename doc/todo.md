# Todo

## Basic objectives

The objective here is to create a functional "comprehensive" that will be used to further rapid prototyping and iteration.

~~start with an empty framework (201n10-Framework)~~
~~add a basic header and main~~
~~add two sections, one for the survey and one for the prestartSectionId instructions~~
~~add 3 images (not random) to the survey and style to with approximate cookie-stand shop page theme.~~
~~add some boilerplate html to the prestartSectionId section. a form, some yadda yadda text~
~~add some javascript to hide the prestartSectionId and display the survey sections~~
~~add some javascript for the "links" in the header since we won't be using any anchors~~
make the survey article clickable, not the image. or make the image fit the box (see Images Scaling below)

## More advanced survey functionality

~~add random function to select three images conforming to specifications~~
add Survey constructor to collect image display and selection data from multiple subjects.

## Add the form to the researcher prestartSectionId section

~~Collect a participants name and generate a GUID to uniquely identify the user in the reports.~~

## Add a report section (not a page) to display tables (pivots? stretch!)

- Display tables of all users that have taken the survey.
- Create summary/detail or just detail? (stretch!)

## Ensure the images scale to fit the box based, and don't automatically flex(!)/slide down the page

- The instructions say always ensure they are three across. Scale the images with the window rather than slide them down the page.
- Remove flexbox (copied from cookie-stand shop.css)
- Test in "researcher" provided 9.7" tablet device.

## Other

do something about all the global variables being passed around.