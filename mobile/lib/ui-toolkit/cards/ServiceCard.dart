import 'package:flutter/material.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';


class ServiceCard extends StatefulWidget {
  final Service service;

  const ServiceCard({super.key, required this.service});

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
              padding: EdgeInsets.all(20),
              child: Image.asset(
                  widget.service.icon.path,
                  width: 100,
                  height: 100,
              ),
            ),
            Expanded(
                child:Column(
                  children: [
                    SizedBox(height: 10,),
                    Text(widget.service.name, style: PlugItStyle.subtitleStyle),
                    SizedBox(height: 30,),
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
