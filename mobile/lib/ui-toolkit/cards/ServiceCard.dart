import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:transparent_image/transparent_image.dart';


class ServiceCard extends StatefulWidget {
  final Service service;
  final void Function()? onChangeState;

  const ServiceCard({super.key, required this.service, this.onChangeState});

  @override
  State createState() => _StateServiceCard();
}
class _StateServiceCard extends State<ServiceCard>{
  bool pressed = false;

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
                    widget.service.connected
                        ? ScreenWidthButton(label:"Connected", color: PlugItStyle.validationColor, pressedColor: PlugItStyle.validationColor, height: 40,)
                        : const ScreenWidthButton(label:"Connection", height: 40)
                  ],
              )
            )
          ],
        )
      )
    );

  }
}
