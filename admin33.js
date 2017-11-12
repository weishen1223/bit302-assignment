card.className = 'card';
          card_container.className = 'container';
          subjectCode.innerHTML= "Subject Code: "+val.subjectCode;
          date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
          time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
          venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
          var status = val.approve;
          if(status == true){
            // card.id = local+"_true";
            card.id = "true_"+data.key;

            var container = document.getElementById('approved');
            subjectCode.style.paddingTop = "5px";
            venue.style.paddingBottom = "5px";
            date.innerHTML= "Date: <b contenteditable = 'false'>"+val.replace_date+"</b>";
            time.innerHTML= "Time: <b contenteditable = 'false'>"+val.replace_startTime+" - "+val.replace_endTime+"</b>";
            venue.innerHTML= "Venue: <b contenteditable = 'false'>"+val.replace_venue+"</b>";
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event_approved, card_container.firstChild);
            card_container.insertBefore(venue, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);

          }else {
            // card.id = local+"_false";
            card.id = "false_"+data.key;
            var container = document.getElementById('pending');
            subjectCode.style.paddingTop = "5px";
            time.style.paddingBottom = "5px";
            // pendingKey.push(keyObj);
            container.insertBefore(card, container.firstChild);
            card.insertBefore(card_container, card.firstChild);
            card_container.insertBefore(div_event, card_container.firstChild);
            card_container.insertBefore(time, card_container.firstChild);
            card_container.insertBefore(date, card_container.firstChild);
            card_container.insertBefore(subjectCode, card_container.firstChild);
          }