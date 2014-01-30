Oculus-demo
===========

Demo project using AngularJS to interface with the Youtube API

Restrictions:
-------------

* Youtube feed API and renders videos about Oculus using only JS, HTML & CSS
* Only a body tag on initial render.
* All markup should be rendered using a templating engine like Dust, Twig, Mustache, etc.
* Should show one video at a time.
* Navigation for different videos, each nav item should show a small screenshot of the video.
* Videos should load dynamically without any change to the page's URL
* Cache video data already retrieved from Youtube.

Sugar n' Spice
--------------
* Http Interceptor handling server messages of the 400 & 500s varities.
* Caching of videos on localstorage to avoid unnecessary bandwidth. 

Other Thoughts:
---------------

* You can use whatever JS components/libraries you want.
* Please ensure that the application works in recent Chrome, FF, IE and Safari.

Ethos Of the Build:
-------------------

The goal of this test is not to produce code that simply meets the requirements stated above.
The goal is to provide us with an example of the best client-side application you can create using the given constraints.  