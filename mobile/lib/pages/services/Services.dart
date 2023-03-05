import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import '../../models/plug/Plug.dart';
import '../../models/service/Service.dart';
import '../../ui-toolkit/cards/ServiceCard.dart';

class Services extends StatefulWidget {
  const Services({super.key});
  @override
  State<Services> createState() => _ServicesState();
}

class _ServicesState extends State<Services> {
  List<Service>? services;

  List<Widget> _getServiceCards() {
    List<Widget> widgets = [];
    for (Service service in services ?? []) {
      widgets.add(ServiceCard(service: service));
    }

    return widgets;
  }

  @override
  void initState() {
    super.initState();
    PlugApi.getServices().then((value) => setState(() => {services = value}));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: true,
        body: ListView(
          children: _getServiceCards(),
        ));
  }
}
