import 'package:flutter/material.dart';
import '../../models/Plug/Plug.dart';
import '../../models/service/Service.dart';
import '../../ui-toolkit/cards/ServiceCard.dart';


class Services extends StatefulWidget {
  List<Service>? services;

  Services({super.key, this.services});
  @override
  State<Services> createState() => _ServicesState();
}

class _ServicesState extends State<Services> {

  List<Widget> _getServiceCards()
  {
    List<Widget> widgets = [];
    for (Service service in widget.services!) {
      widgets.add(ServiceCard(service: service));
    }

    return widgets;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ListView(
          children: _getServiceCards(),
        )
    );
  }
}