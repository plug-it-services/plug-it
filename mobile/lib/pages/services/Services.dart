import 'package:flutter/material.dart';
import '../../models/Plug.dart';
import '../../models/Service.dart';
import '../../ui-toolkit/cards/ServiceCard.dart';


class Services extends StatefulWidget {
  List<Service>? services;
  List<Plug>? plugs;

  Services({super.key, this.services, this.plugs});
  @override
  State<Services> createState() => _ServicesState();
}

class _ServicesState extends State<Services> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ListView(
          children: [
            ServiceCard(service: Service(name: 'Youtube', id:"1", connected: false, icon: Uri(path:"assets/icon/youtube.png"), )),
            ServiceCard(service: Service(name: 'Youtube', id:"1", connected: true, icon: Uri(path:"assets/icon/youtube.png"), )),

          ],
        )
    );
  }
}