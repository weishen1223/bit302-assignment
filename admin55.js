var card = document.createElement('div');
          var card_container = document.createElement('div');
          card.className = 'card';
          card_container.className = 'container';
          subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
          date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
          time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
          venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";

          var status = val.approve;
          if(status == true){
            card.id = "true_"+data.key;
            var container = document.getElementById('approved');
            subjectCode.style.paddingTop = "5px";
            venue.style.paddingBottom = "5px";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
            time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
            venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
            card_container.insertBefore(div_event_approved, card_container.firstChild);
            card_container.insertBefore(venue, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

            var divRemoved = document.getElementById("false_"+data.key);
            if (divRemoved) {
                divRemoved.remove();
            }
          }else {
            card.id = "false_"+data.key;
            var container = document.getElementById('pending');
            subjectCode.style.paddingTop = "5px";
            time.style.paddingBottom = "5px";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

            var divRemoved = document.getElementById("true_"+data.key);
            if (divRemoved) {
                divRemoved.remove();
            }
          }
        });

        replacementRef.on('child_removed', function(data) {
          var val = data.val();
          var status = val.approve;
          if(status == true){
            var divRemoved = document.getElementById("true_"+data.key);
            divRemoved.remove();
          }else {
            var divRemoved = document.getElementById("false_"+data.key);
            divRemoved.remove();
          }
        });