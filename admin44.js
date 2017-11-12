replacementRef.on('child_changed', function(data) {
          var val = data.val();
          var uKey = data.key;
          var subjectCode = document.createElement('p');
          var date = document.createElement('p');
          var time = document.createElement('p');
          var venue = document.createElement('p');
          var venueInput = document.createElement('input');
          venueInput.placeholder = "Please enter venue.";
          venueInput.id = "venueInput_"+uKey;
          // create Buttons
          var decline = document.createElement('button');
          var decline_txt = document.createTextNode("Decline");
          decline.className = 'button';
          decline.id = 'decline_btn'
          decline.style.float = 'right';
          decline.style.marginRight = '10px';
          decline.appendChild(decline_txt);
          decline.onclick = function(){
            declineApply(this.id);
          };
          var approve = document.createElement('button');
          var approve_txt = document.createTextNode("Approve");
          approve.className = 'button';
          approve.id = data.key;
          approve.appendChild(approve_txt);
          approve.onclick = function(){
            approveApply(this.id);
          };

          var edit = document.createElement('button');
          var edit_txt = document.createTextNode("Edit");
          edit.className = 'button';
          edit.id = data.key;
          edit.appendChild(edit_txt);
          edit.onclick = function(){
            // editApply(this.id);
          };

          var div_event = document.createElement('p');
          div_event.appendChild(venueInput);
          div_event.appendChild(approve);
          div_event.appendChild(decline);

          var div_event_approved = document.createElement('p');
          div_event_approved.appendChild(edit);