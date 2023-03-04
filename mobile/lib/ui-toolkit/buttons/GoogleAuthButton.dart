import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile/PlugApi.dart';

GoogleSignIn _googleSignIn = GoogleSignIn(
  // The OAuth client id of your app. This is required.
  // clientId: "280724198431-ss853orb3f45s3k7qbu1eh6kbeerqta1.apps.googleusercontent.com",
  scopes: [
    'email',
    'profile',
  ]
  // If you need to authenticate to a backend server, specify its OAuth client. This is optional.
);

class GoogleAuthButton extends StatefulWidget {
  final void Function()? callback;

  const GoogleAuthButton({super.key, this.callback});

  @override
  State createState() => _StateGoogleAuthButton();
}
class _StateGoogleAuthButton extends State<GoogleAuthButton>{
  bool pressed = false;
  String? error;

  void onTap() {
    setState(() {
      pressed = true;
    });
  }

  void onEnd() {
    if (!pressed) {
        return;
    }
    setState(() {
      pressed = false;
    });
    print('trying google sso');
    _googleSignIn.signIn().then((account) {
      account?.authentication.then((result) {
        PlugApi.ssoLogin("google", result.accessToken!).then((result) => {
          widget.callback!()
        });
      });
    }).catchError((err) {
      error = err.toString();
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
                          fit:BoxFit.cover,
                          errorBuilder: (BuildContext context, Object expection, StackTrace? trace) {
                            return const Icon(Icons.error) as Widget;
                          },
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
