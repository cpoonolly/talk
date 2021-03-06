---
title: Tracking Talk Events and Metrics
permalink: /integrating/event-tracking-metrics/
---

Talk supports event emitting. This means that common actions taken within Talk, such as successfully posting a comment, posting a reaction, or changing a setting, are automatically emitted from Talk. To send these events to your analytics tool of choice, you’ll need to configure your Talk embed to process them. 

The following example demonstrates how the event emitter works on a sample article page generated by Talk. When you’re ready to capture and handle events from your actual site, add the events property along with your event handling functions to your Talk embed script. 

## Example Using Local Development Instance of Talk
If you have Talk running in a local development environment you can follow these steps to first view all of the events emitted by Talk, and then capture the `PostComment.success` event and send it to a third party analytics provider. 


First, with Talk running, ensure that you can access the `/dev/assets` endpoint and create a random article (i.e.: `localhost:3000/dev/assets`).


Then in Talk, uncomment the events code in `/views/dev/article.njk` 
(https://github.com/coralproject/talk/blob/master/views/dev/article.njk#L32). This will enable events to be sent via the Talk embed that is on the sample article page. This will start a stream of events to the browser console, so that you can see which events are available.

```
    events: function(events) {
      events.onAny(function(eventName, data) {
        // logs all available events.
        console.log(eventName, data);
     });
   },
```

Save your changes to `article.njk`, restart Talk, and try refreshing your article in a browser with development console open. You should see the console log the list of Talk’s events.


Next, we want to add our code that sends the events to our analytics system. In this example, we're sending the `PostComment.success`  event. The particular way you send this will depend on what tool you're using. Refer to your tool's API and docs to determine this.

```
    events: function(events) {
      events.onAny(function(eventName, data) {
        console.log(eventName, data);
        if (eventName === 'mutation.PostComment.success') {
          my_event_tracker.send('postComment', data);
        }
      });
    },
```
You can continue this process for any specific events you'd like to track. You can also remove the `console.log` to stop events being emitted to the browser and instead only send the events to your analytics tool.
