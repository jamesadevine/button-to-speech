// auto-generated, do not edit.
namespace myModules {

    //% fixedInstance block="button2"
    export const button2 = new modules.ButtonClient("button2");

    //% fixedInstance block="button3"
    export const button3 = new modules.ButtonClient("button3");


    // start after main
    control.runInParallel(function() {
            myModules.button2.start();
            myModules.button3.start();
        
    })
}
    