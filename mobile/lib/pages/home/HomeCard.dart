import 'package:flutter/material.dart';
import '../../models/plug/Plug.dart';
import '../../models/service/Service.dart';


class HomeCard extends StatefulWidget {
  String title;
  String description;
  HomeCard({super.key, required this.title, required this.description});

  @override
  State<HomeCard> createState() => _HomeCardState();
}

class _HomeCardState extends State<HomeCard> {
  @override
  Widget build(BuildContext context) {
    return
          Padding(
              padding: const EdgeInsets.all(8.0),
              child: Container(
                  decoration: BoxDecoration(
                    color: Colors.blue.shade700,
                    border: Border.all(
                      width: 0,
                      color: Colors.transparent
                    ),
                    borderRadius: const BorderRadius.all(Radius.circular(5))
                  ),
                  height: 120,
                  child: Expanded(
                      child:Column(
                        children: [
                          Center(
                              child: Text(widget.title, style: const TextStyle(fontSize:20, fontWeight: FontWeight.w600))
                          ),
                          const Center(
                              child: Padding(
                                  padding: EdgeInsets.all(8.0),
                                  child:Divider(color: Colors.black, thickness: 1,)
                              )
                          ),
                          Center(child: Text(widget.description, style: const TextStyle(fontSize:17, fontWeight: FontWeight.w300))),
                        ],
                      )
                  )
              )
          );
}
}