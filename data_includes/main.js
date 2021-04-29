PennController.ResetPrefix(null) // Shorten command names (keep this line here)

// NOTE: THIS SCRIPT WILL ONLY FULLY WORK WITH A VALID ACCOUNT
// You can still use this project for illustration purposes,
// the audio recordings just won't get saved

// The sequence of trials in this experiment
Sequence(
    "init" // Start with initiating the recorder
    ,
    // Run the 'record'-labeled trial (see Template below) in a randomized order,
    // and insert the 'async'-labeled trial (see UploadRecordings below) between each trial
    sepWith("async", randomize("record"))
)


// Replace the URL with one that points to a PHP file on your own webserver
InitiateRecorder("https://my.server/path/to/file.php").label("init")


// This creates a trial labeled 'async' that will upload
// all the samples recorded by the time it is run
UploadRecordings("async","noblock")


// We'll create multiple trials following the same structure
Template( "listofletters.csv" , row =>
  newTrial( "record" ,
    newText("instructions", "After you click Start, you will have 10 seconds to say out loud"+
            " as many words as you can think of starting with the letter <strong>"+row.letter+"</strong>")
        .center()
        .print()
    ,
    newButton("Start").center().print().wait().remove()
    ,
    // Start recording
    newMediaRecorder(row.letter+"-words", "audio").record()
    ,
    // Wait 10000ms before stopping the recorder
    newTimer(10000).callback(getMediaRecorder(row.letter+"-words").stop()).start().wait()
    ,
    getText("instructions").remove()
    ,
    newText("Thank you! If you like, you can listen to the recording before proceeding").print()
    ,
    // Play the recording upon click on this button
    newButton("Play recorder").callback(getMediaRecorder(row.letter+"-words").play()).print()
    ,
    newButton("Next").print().wait()
    ,
    // Stop any playback before moving to the next trial
    getMediaRecorder(row.letter+"-words").stop()
  )
  // Report which letter this trial is about in the results file
  .log("letter", row.letter)
)