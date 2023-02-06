import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/cards/PlugCard.dart';
import 'package:mobile/ui-toolkit/cards/ServiceCard.dart';


class Navigate extends StatefulWidget {
  final void Function(Plug plug) onPlugSelected;

  const Navigate({super.key, required this.onPlugSelected});
  @override
  State<Navigate> createState() => _NavigateState();
}

class _NavigateState extends State<Navigate> {
  Map<Plug, PlugDetails> plugs = {};
  List<Service>? services;
  Map<Plug, PlugDetails> filteredPlugs = {};
  List<Service>? filteredServices;
  String filter = "";

  final controller = TextEditingController();

  @override
  void initState() {
    PlugApi.getPlugs().then((plugsData) => setState(() {
      for (Plug plug in plugsData!) {
        PlugApi.getPlug(plug.id).then((value) {
          print("Found plug with id: '${value!.name}'");
          setState(() {
            plugs[plug] = value;
            filteredPlugs = plugs;
          });
        });
      }

    }));
    PlugApi.getServices().then((value) => setState(() {
      services = value;
        setState(() => {
          filteredServices = services
        });
    }));
    super.initState();
  }

  void setFilteredServices(String filter)
  {
    filter = filter.toLowerCase();
    final filtered = services!
        .where((element) =>
        element.name.toLowerCase().contains(filter)
    ).toList();

    setState(() {
      filteredServices = filtered;
    });
    print("Found ${filtered.length} services with filter: '$filter'!");
  }

  void setFilteredPlugs(String filter)
  {
    filter = filter.toLowerCase();
    print("Searching in ${plugs.length} plugs ...");
    plugs.forEach((plug, details) => {
      if (plug.name.toLowerCase().contains(filter) || details.containsFilter(filter)) {
        setState(() {
          filteredPlugs[plug] = details;
        })
      }
    });
    print("Found ${filteredPlugs.length} plugs with filter: '$filter'!");
  }

  onFilter(value) {
    setFilteredPlugs(value);
    setFilteredServices(value);
  }

  List<Widget> getFilterService(data ) {
    if (data == null || data!.isEmpty) {
      return [];
    }
    var services = [];
    
    for (var service in data!) {
      services.add(const SizedBox(height: 5,));
      services.add(ServiceCard(service: service));
    }

    if (services.isEmpty) {
      return [];
    }
    
    return [
      const SizedBox(height: 10,),
      const Text("Services", style: PlugItStyle.subtitleStyle),
      const Divider(color: Colors.black,),
      ...services
    ];
  }

  List<Widget> getFilterPlugs(Map<Plug, PlugDetails> data) {
    if (data.isEmpty) {
      return [];
    }
    var plugCards = [];

    data.forEach((key, value) {
      plugCards.add(const SizedBox(height: 5,));
      plugCards.add(PlugCard(plug: key, callback: () => {
        widget.onPlugSelected(key)
      }));
    });
    if (plugCards.isEmpty) {
      return [];
    }

    return [
      const SizedBox(height: 10,),
      const Text("Plugs", style: PlugItStyle.subtitleStyle),
      const Divider(color: Colors.black,),
      ...plugCards
    ];

  }


  @override
  Widget build(BuildContext context) {
    return ListView(
          children: [
            Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              child: TextField(
                controller: controller,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search),
                  hintText: 'Search for ...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color:PlugItStyle.primaryColor),
                  )
                ),
                onChanged: onFilter,
              )
            ),
            ...getFilterPlugs(filteredPlugs),
            ...getFilterService(filteredServices),
          ],
    );
  }
}