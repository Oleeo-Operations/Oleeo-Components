# Oleeo React Components

This project exposes components for use on Oleeo Careers Sites.

## Installation and Local Development

To install locally:

1. Clone this repository
2. Run `npm install`
3. Run `npm run serve`. The project will open on localhost:8080.

## Usage

These components all require React and ReactDOM scripts to be added to the `<head>` of all Webflow pages which use the components. This can be added using:

```html
<script
  src="https://unpkg.com/react@16/umd/react.production.min.js"
  crossorigin
></script>
<script
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
  crossorigin
></script>
```

**Note**: only version 16 of React and ReactDOM have been tested.

The component source code can be accessed using jsDelivr. A script tag must be added into the `<head>` of the pages which are to contain the components. To access the latest version, use:

```html
<script src="https://cdn.jsdelivr.net/gh/Oleeo-Operations/Oleeo-Components@0/dist/main.js"></script>
```

All components have been assigned to the `window.oleeo` object and can be accessed from there.

E.g. for the HomepageTiles component:

```javascript
window.oleeo.HomepageTiles;
```
### Accessibility

As it currently stands Webflow does not provide an easy way to add alternate attributes to iframe videos (specifically in rich text elements OR within a CMS). Due to this, a small amount of custom code placed in the footer code in Webflow will ensure WCAG AA compliancy:

```html
<script>
    const iframe = document.querySelectorAll('IFRAME')
    for(var i = 0; i < iframe.length; i++){
        iframe[i].setAttribute('title', 'Media Content')
    }
</script>
 ```
 
### HomepageTiles Component

This component renders a "tile" for each job category passed as props, including a background image and a count of how many jobs are available in each category.

![A screenshot of the HomepageTiles Component](./docs/screenshots/HomepageTiles.png)

#### Basic Usage

```html
<div id="homepage-vacancy-tiles"></div>
<script>
  window.addEventListener('load', function () {
    ReactDOM.render(
      React.createElement(window.oleeo.HomepageTiles, {
        feedURL:
          'https://kirklees.tal.net/vx/mobile-0/appcentre-1/brand-4/candidate/jobboard/vacancy/4/feed/structured',
        tiles: categories,
        countField: 'directorate',
        directory: '/roles/',
      }),
      document.getElementById('homepage-vacancy-tiles')
    );
  });
</script>
```

#### Params

| **Name**   | **Description**                                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| feedURL    | The URL of the structured RSS Feed from which jobs can be pulled.                                                                                                                                                    |
| tiles      | An array of objects which contain the information required for the tile. It should contain the name, slug and imageURL of the job category and can be created using a Webflow collection.                            |
| countField | The key of the field to match in the RSS feed and count the number of vacancies per category.                                                                                                                        |
| directory  | A string detailing the directory in which the "Job Categories" are in. Related to the "Collection URL" field when creating a new Collection on Webflow. **Note:** This should contain forward slashes e.g. `/roles/` |

#### Styling

In the component there are two versions of homepage tile styles (1 and 2). The default style (1) can be seen in the above screenshot - it is worth noting that if a style is not specified, this style will be rendered. To specify a style, add in the same place you create the custom embed for the CMS collection mapping the homepage tiles. 

```html 
<script>
    var name = "";
    categories.push({
  	name: name,
	slug: "",
	imageSrc: "",
	style: 2
    });
</script>
```
#### Example of style 2:

![A screenshot of the HomepageListing Component](./docs/screenshots/style2.png.png)

### HomepageListing Component

This component renders a "card" for each job available. Includes configurable properties to display. The component opens a modal with the vacancy description when clicked.

![A screenshot of the HomepageListing Component](./docs/screenshots/HomepageListing.png)

#### Basic Usage

```html
<div id="homepage-vacancy-listing"></div>
<script>
  window.onload = function () {
    ReactDOM.render(
      React.createElement(window.oleeo.VacancyListing, {
        feedURL:
          'https://kirklees.tal.net/vx/mobile-0/appcentre-1/brand-4/candidate/jobboard/vacancy/4/feed/structured',
        numberOfItems: 4,
        propertiesToDisplay: [
          {
            key: 'directorate',
            label: 'Directorate: ',
            isArray: false,
            isHTML: true,
          },
          {
            key: 'service_area',
            label: 'Service Area: ',
            isArray: false,
            isHTML: true,
          },
        ],
        modalPropertiesToDisplay: [
          {
            key: 'service_area',
            label: 'Service Area',
            isArray: false,
            isHTML: true,
          },
          {
            key: 'directorate',
            label: 'Directorate',
            isArray: false,
            isHTML: true,
          },
          {
            key: 'position_type',
            label: 'Position Type',
            isArray: false,
            isHTML: false,
          },
        ],
        noApplyBrandIDs: [4],
        filter: function () {
          return true;
        },
      }),
      document.getElementById('homepage-vacancy-listing')
    );
  };
</script>
```

#### Params

| **Name**                 | **Description**                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| feedURL                  | The URL of the structured RSS Feed from which jobs can be pulled.                                        |
| numberOfItems            | The maximum number of items to display                                                                   |
| propertiesToDisplay      | An array of objects detailing which vacancy properties are displayed on the card. See below for schema.  |
| modalPropertiesToDisplay | An array of objects detailing which vacancy properties are displayed in the modal. See below for schema. |
| filter                   | A JavaScript function to filter the records.                                                             |
| noApplyBrandIDs          | An array of numbers denoting the IDs of brands which adds a message stating there is no instant apply and to read the job description for more information. If the vacancy brand ID matches one of these, the component will display this message. | 
| instantApply             | An array simply stating either 'yes' or 'no'. By default this is left as 'yes' and should therefore only be used if a client wishes to link the apply button directly to the job description within the ATS. |
| applyButtonText          | A string detailing what the apply button should say. If unused or an empty string is applied, then the button will simply say 'Apply Now'. |

#### Schema

| **Item** | **Type** | **Description**                                                                                                                                            |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | string   | The key for the item in the RSS feed. The component will look inside the content tag to find this item.                                                    |
| label    | string   | The label to display before the value.                                                                                                                     |
| isArray  | boolean  | Whether or not the item is an Array. If it is, it automatically includes each item in a comma separated list.                                              |
| isHTML   | boolean  | Whether or not the item contains raw HTML. This should be used with caution as it allows the content to be rendered as is using `dangerouslySetInnerHTML`. |

**Note:** You should not use `isArray` and `isHTML` at the same time.

### Search

A component to display a search bar in which a user can search for vacancies or vacancy categories.

**Note**: This component is still a work in progress and is not yet ready for production.

#### Basic Usage

```html
<div id="homepage-vacancy-search"></div>
<script>
  window.addEventListener('load', () => {
    ReactDOM.render(
      React.createElement(window.oleeo.Search, {
        feedURL:
          'https://kirklees.tal.net/vx/mobile-0/appcentre-1/brand-4/candidate/jobboard/vacancy/4/feed/structured',
        categories: jobCategories,
        fuzzySearchThreshold: 0.5,
        fuzzySearchKeys: ['title'],
        propertiesToDisplay: [
          {
            key: 'directorate',
            label: 'Directorate: ',
            isArray: false,
            isHTML: true,
          },
          {
            key: 'service_area',
            label: 'Service Area: ',
            isArray: false,
            isHTML: true,
          },
        ],
      }),
      document.getElementById('homepage-vacancy-search')
    );
  });
</script>
```

#### Params

| **Name**             | **Description**                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| feedURL              | The URL of the structured RSS Feed from which jobs can be pulled.                                                                                                                   |
| categories           | An array of objects containing the name of each job category. If you're using the HomepageTiles component, this can use the same array as the tiles parameter.                      |
| fuzzySearchThreshold | A float between 0 and 1. A threshold of 0.0 requires a perfect match, a threshold of 1.0 would match anything.                                                                      |
| fuzzySearchFields    | An array of strings which map to items in the RSS Feed against which to perform the fuzzy search. E.g. ['title', 'content.Job_id'] would look at the title and Job_id.              |
| propertiesToDisplay  | An array of objects which determine which fields are displayed in the vacancy search result. Follows the same schema as the VacancyListing component propertiesToDisplay parameter. |

## Cross Browser Compatibility

The project is configured to include polyfills so that it works on older versions of IE.

## Accessibility

The components have been created to be fully compliant with Web Content Accessibility Guidelines (WCAG) level AA.

## Testing

The project uses Jest and Enzyme for unit testing. To run these tests, simply use the command `npm test` or to run Jest in watch mode, use `npm run test:watch`.
For documentation, see:

- https://jestjs.io/docs/en/getting-started
- https://enzymejs.github.io/enzyme/

## GitHub Actions

A workflow has been created on GitHub actions to release the code when there is a push to the `main` branch. Each push, assuming tests pass, creates a new release, the latest of which which can be accessed on Webflow using:

```html
<script
  src="https://cdn.jsdelivr.net/gh/Oleeo-Operations/Oleeo-Components@0/dist/main.js"
  async
></script>
```

**Note:** Using the above code will eventually access the latest changes, however it often takes a while (8-24 hours) for jsdelvr to sync. If an urgent change is required, use the specific version which can be found from github tags. E.g - "https://cdn.jsdelivr.net/gh/Oleeo-Operations/Oleeo-Components@0.26.0/dist/main.js". You SHOULD change this back to @0 once the latest code is accessed from jsdelvr as to avoid potential issues. 


**Note:** A pre-commit hook has been created using Husky to build the code. This hooks runs the tests, and builds the code. A commit is not allowed if this fails.

## Key Contacts

Matt Hawes - matthew.hawes@oleeo.com
Siva Mayuran - sivalingham.mayuran@oleeo.com
