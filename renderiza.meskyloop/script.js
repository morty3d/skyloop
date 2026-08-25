/* =========================================
   SCROLL SUAVE
========================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {


            link.addEventListener(

                "click",

                function(event) {


                    const href =

                        this.getAttribute(
                            "href"
                        );


                    if (
                        href === "#"
                    ) {

                        event.preventDefault();

                        return;

                    }


                    const target =

                        document.querySelector(
                            href
                        );


                    if (
                        !target
                    ) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }

            );

        }

    );