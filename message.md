---
layout: default
title: Message
---
<div role="main" class="main-content main-post-content full-width">
<div class="well">
    
{% assign response = '/thank-you' | prepend: site.url %}

<form action="http://formspree.io/kingchadwu@gmail.com" method="POST">

  <div class="row">
    <label class="form-label" for="input-text">Your Name:</label>
  </div>

  <div class="row">
     <input type="text" name="name" placeholder="T" required>
  </div>

  <div class="row">
    <label class="form-label" for="input-text">Your E-mail:</label>
  </div>

  <div class="row">
   <input type="email" name="_replyto" placeholder="@" required>
  </div>

  <div class="row">
    <label class="form-label" for="textarea">Your message:</label>
  </div>

  <div class="row">
      <textarea cols="40" rows="8" name="message" placeholder="Type your message here"></textarea>
  </div>

  <input type="submit" class="btn btn-red" value="Send">
  <input type="hidden" name="_next" value="{{ response }}" />

</form> 
</div>
</div>