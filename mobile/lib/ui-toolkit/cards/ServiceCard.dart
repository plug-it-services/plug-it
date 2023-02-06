import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
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
      //TODO: need to input api key
      setLoading(true);
      PlugApi.OAuthApiKey(widget.service.name, '').then((value) {
      Future.delayed(const Duration(seconds: 2)).then((value) {
          setState(() => {connected = true});
          setLoading(false);
        });
      });
    }
    if (widget.service.authType == 'clientSecrets') {
      //TODO: need to input credentials
      setLoading(true);
      PlugApi.OAuthCredentials(widget.service.name, '', '').then((value) {
      Future.delayed(const Duration(seconds: 2)).then((value) {
          setState(() => {connected = true});
          setLoading(false);
        });
      });
    }
  }

  void disconnectService() {
    print('Disconnect pressed');
    setLoading(true);
    PlugApi.disconnectService(widget.service.name).then((value) {
    Future.delayed(const Duration(seconds: 2)).then((value) {
        setState(() => {connected = false});
        setLoading(false);
      });
    });
  }

  @override
  void initState() {
    super.initState();
    connected = widget.service.connected;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Container(
        decoration: BoxDecoration(
          //TODO: make a dominant color picker of the icon to color the container
          color: PlugItStyle.cardColor,
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
                      Row(
                        children: [
                          (loading) ? const CircularProgressIndicator(color:Colors.black) : const SizedBox(height: 0,),
                          Expanded(child:ScreenWidthButton(
                              label: (connected) ? "Connected" : "Connection",
                              color: (connected) ? PlugItStyle.validationColor : null,
                              pressedColor: (connected) ? PlugItStyle.validationColor!.withAlpha(200) : null,
                              height: 40,
                              enabled: !loading,
                              callback: () => (connected) ? disconnectService() : handleOAuth2(),
                          ))
                        ]
                      )
                  ],
              )
            )
          ],
        )
      )
    );

  }
}
