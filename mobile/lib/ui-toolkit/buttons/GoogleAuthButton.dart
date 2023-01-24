import 'package:flutter/material.dart';

class GoogleAuthButton extends StatefulWidget {
  final void Function()? callback;

  const GoogleAuthButton({super.key, this.callback});

  @override
  State createState() => _StateGoogleAuthButton();
}
class _StateGoogleAuthButton extends State<GoogleAuthButton>{
  bool pressed = false;

  void onTap() {
    setState(() {
      pressed = true;
    });
  }

  void onEnd() {
    setState(() {
      pressed = false;
      widget.callback!();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            onEnd: onEnd,
            height: 55,
            decoration: BoxDecoration(
              color: (pressed) ? Colors.grey[400] : Colors.grey[200],
              border: Border.all(color: (!pressed) ? Colors.black : Colors.black12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
                child: Row(
                    children: [
                      const SizedBox(width: 20),
                      Image.network(
                          'http://pngimg.com/uploads/google/google_PNG19635.png',
                          fit:BoxFit.cover
                      ),
                      const SizedBox(width: 25),
                      const Text(
                          "Sign-in with Google",
                          style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold)
                      ),
                    ]
                )
            )
        ),
      ),
    );
  }
}
