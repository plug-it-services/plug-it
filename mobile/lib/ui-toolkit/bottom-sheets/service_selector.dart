import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/cards/ServiceCard.dart';


class ServiceMenu extends StatefulWidget {
  final Service? selectedService;
  final List<Service> services;
  final void Function(Service service) onServiceSelected;

  const ServiceMenu({super.key,
    required this.services,
    required this.onServiceSelected,
    required this.selectedService,
  });

  @override
  State createState() => _StateServiceMenu();
}
class _StateServiceMenu extends State<ServiceMenu>{
  List<Service>? filteredServices;
  String filter = "";
  final controller = TextEditingController();

  void setFilteredServices(String filter)
  {
    filter = filter.toLowerCase();
    final filtered = widget.services
        .where((element) =>
        element.name.toLowerCase().contains(filter)
    ).toList();
    setState(() {
      filteredServices = filtered;
    });
  }
  void displayMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context2) {
        List<Widget> list = [];
        for (Service service in filteredServices ?? []) {
          list.add(const SizedBox(height: 10,));
          list.add(GestureDetector(
              onTap: () {
                widget.onServiceSelected(service);
                Navigator.pop(context);
              },
              child: ServiceCard(service: service,)
          ));
        }

        return ListView(
          children: [
            Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              child: TextField(
                controller: controller,
                decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: 'Search a service',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color:PlugItStyle.primaryColor),
                    )
                ),
                onChanged: setFilteredServices,
              ),
            ),
            ...list
          ],
        );
      },

    );
  }


  @override
  void initState()
  {
    filteredServices = widget.services;
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 5),
      child: ElevatedButton(
          onPressed: () {
            displayMenu(context);
          },
          child: Row(
            children: [
              (widget.selectedService == null)
                  ? const Icon(Icons.search_rounded,)
                  : CachedNetworkImage(
                      imageUrl: "${PlugApi.assetsUrl}/${widget.selectedService!.icon}",
                      placeholder: (context, url) => const CircularProgressIndicator(),
                      errorWidget: (context, url, error) => const Icon(Icons.error),
                      //TODO: add proper color from DTO model
                      width: 30,
                      height: 30,
              ),
              const SizedBox(width: 5),
              Text(
                  (widget.selectedService == null) ? "Select a service" : " ${widget.selectedService!.name.capitalize()}",
                  style: PlugItStyle.subtitleStyle
              ),
            ],
          )
      )
    );
  }
}
