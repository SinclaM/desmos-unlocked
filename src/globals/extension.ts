// Firefox only allows primitive types to be sent from the content script to the page context.
// Firefox provides the builtin cloneInto function to allow sending objects between these
// contexts.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#cloneinto
/* eslint-disable */ // FIXME
declare const cloneInto: (<T>(toClone: T, context: any) => T) | undefined;
