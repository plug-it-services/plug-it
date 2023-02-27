import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/cards/ErrorLabel.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';
import 'package:transparent_image/transparent_image.dart';


class ServiceCard extends StatefulWidget {
  final Service service;

  const ServiceCard({super.key, required this.service});

  @override
  State createState() => _StateServiceCard();
}
class _StateServiceCard extends State<ServiceCard>{
  bool pressed = false;
  bool connected = false;
  bool loading = false;
  bool apiKeyInput = false;
  bool apiCredentialsInput = false;
  String apiKeyValue = "";
  String apiCredentialsId = "";
  String apiCredentialsSecret = "";

  void setLoading(bool state) {
    setState(() {
      loading = state;
    });
  }
  void handleOAuth2() {
    if (widget.service.authType == 'oauth2') {
      setLoading(true);
      PlugApi.OAuth2(widget.service.name).then((value) {
      Future.delayed(const Duration(seconds: 2)).then((value) {
          setState(() => {connected = true});
          setLoading(false);
        });
      });
    }
    if (widget.service.authType == 'apiKey') {
      setState(() {
        apiKeyInput = true;
      });

    }
    if (widget.service.authType == 'clientSecrets') {
      setState(() {
        apiCredentialsInput = true;
      });
    }
  }

  void disconnectService() {
    setLoading(true);
    PlugApi.disconnectService(widget.service.name).then((value) {
    Future.delayed(const Duration(seconds: 2)).then((value) {
        setState(() => {connected = false});
        setLoading(false);
      });
    });
  }

  void onConfirm() {
    setLoading(true);
    if (apiCredentialsInput) {
      PlugApi.OAuthCredentials(widget.service.name, apiCredentialsId, apiCredentialsSecret).then((value) {
        Future.delayed(const Duration(seconds: 2)).then((value) {
          setState(() => {connected = true});
          setState(() => {apiCredentialsInput = false});
          setLoading(false);
        });
      });
    } else {
      PlugApi.OAuthApiKey(widget.service.name, apiKeyValue).then((value) {
        Future.delayed(const Duration(seconds: 2)).then((value) {
          setState(() => {connected = true});
          setState(() => {apiKeyInput = false});
          setLoading(false);
        });
      });
    }
  }


  List<Widget> getApiKeyInput() {
    if (apiKeyInput) {
      return [
        InputField(
          hint: "Enter Api Key",
          onChanged: (value) => {apiKeyValue = value},
          icon: const Icon(Icons.key),
        ),
        const SizedBox(height: 5,),
        Row(
          children: [
            (loading) ? const CircularProgressIndicator(color:Colors.black) : const SizedBox(height: 0,),
            Expanded(
              child:  ScreenWidthButton(label: "Confirm", height: 40, callback: onConfirm,),
            ),
          ],
        ),
        const SizedBox(height: 5,)
      ];
    }
    else {
      return getApiOAuthLayout();
    }
  }

  List<Widget> getApiCredentialsInput() {
      if (apiCredentialsInput) {
        return [
          InputField(
            hint: "Enter Client Id",
            onChanged: (value) => {apiCredentialsId = value},
            icon: const Icon(Icons.perm_identity),
          ),
          const SizedBox(height: 5,),
          InputField(
            hint: "Enter Client Secret",
            onChanged: (value) => {apiCredentialsSecret = value},
            icon: const Icon(Icons.password),
          ),
          const SizedBox(height: 5,),
          Row(
            children: [
              (loading) ? const CircularProgressIndicator(color:Colors.black) : const SizedBox(height: 0,),
              Expanded(
                child:  ScreenWidthButton(
                  label: "Confirm",
                  height: 40,
                  callback: onConfirm,
                ),
              ),
            ],
          ),
          const SizedBox(height: 5,)
        ];
      }
      else {
        return getApiOAuthLayout();
      }
  }

  List<Widget> getApiOAuthLayout() {
      return [
        Row(
            children: [
              (loading) ? const CircularProgressIndicator(color:Colors.black) : const SizedBox(height: 0,),
              Expanded(
                  child: ScreenWidthButton(
                    label: (connected) ? "Connected" : "Connection",
                    color: (connected) ? PlugItStyle.validationColor : null,
                    pressedColor: (connected) ? PlugItStyle.validationColor!.withAlpha(200) : null,
                    height: 40,
                    enabled: !loading,
                    callback: () => (connected) ? disconnectService() : handleOAuth2(),
                  )
              )
            ]
        )
      ];
  }

  List<Widget> getCardLayout() {
    if (widget.service.authType == 'oauth2') {
      return getApiOAuthLayout();
    }
    if (widget.service.authType == 'apiKey') {
      return getApiKeyInput();
    }
    if (widget.service.authType == 'clientSecret') {
      return getApiCredentialsInput();
    }
    return [
      ErrorCard(
        errorMessage: "Failed to identify service auth type: '${widget.service.authType}'",
        big: true,
        errorLevel: Level.error,

      )
    ];
  }

  @override
  void initState() {
    setState(() => {
      connected = widget.service.connected
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Container(
        decoration: BoxDecoration(
          color: widget.service.color,
          borderRadius: BorderRadius.circular(8)
        ),
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: CachedNetworkImage(
                imageUrl: "${PlugApi.assetsUrl}/${widget.service.icon}",
                placeholder: (context, url) => const CircularProgressIndicator(),
                errorWidget: (context, url, error) => const Icon(Icons.error),
                width: 100,
                height: 100,
              ),
            ),
            Expanded(
                child:Column(
                  children: [
                      const SizedBox(height: 10,),
                      Text(widget.service.name.capitalize(), style: PlugItStyle.subtitleStyle),
                      const SizedBox(height: 30,),
                      ...getCardLayout()
                  ]
              )
            )
          ],
        )
      )
    );

  }
}
