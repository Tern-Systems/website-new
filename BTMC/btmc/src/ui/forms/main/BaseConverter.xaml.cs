using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using btmc.src.ui.forms.main.components;

namespace btmc.src.ui.forms.main
{
    public partial class BaseConverter : UserControl
    {
        public BaseConverter()
        {
            InitializeComponent();
          

        }

        private void BTMCToggle_Checked(object sender, RoutedEventArgs e)
        {
            if (BTMCLayout != null && TERNLayout != null && TERNToggle != null)
            {
                BTMCLayout.Visibility = Visibility.Visible;
                TERNLayout.Visibility = Visibility.Collapsed;
                TERNToggle.IsChecked = false;
            }
        }

        private void TERNToggle_Checked(object sender, RoutedEventArgs e)
        {
            if (BTMCLayout != null && TERNLayout != null && BTMCToggle != null)
            {
                BTMCLayout.Visibility = Visibility.Collapsed;
                TERNLayout.Visibility = Visibility.Visible;
                BTMCToggle.IsChecked = false;
            }
        }
        private void Convert_Click(object sender, RoutedEventArgs e)
        {
            // TODO: Add your conversion logic here
            MessageBox.Show("Convert button clicked!");
        }
        public TextBox[] GetActiveInputTextBoxes()
        {
            if (BTMCLayout.Visibility == Visibility.Visible)
            {
                return GetTextBoxesFrom(BTMCLayout);
            }
            else if (TERNLayout.Visibility == Visibility.Visible)
            {
                return GetTextBoxesFrom(TERNLayout);
            }
            return new TextBox[0];
        }

        private TextBox[] GetTextBoxesFrom(DependencyObject parent)
        {
            var result = new List<TextBox>();
            GetTextBoxesRecursive(parent, result);
            return result.ToArray();
        }

        private void GetTextBoxesRecursive(DependencyObject parent, List<TextBox> list)
        {
            int count = VisualTreeHelper.GetChildrenCount(parent);
            for (int i = 0; i < count; i++)
            {
                var child = VisualTreeHelper.GetChild(parent, i);

                if (child is TextBox tb)
                {
                    list.Add(tb);
                }
                else
                {
                    GetTextBoxesRecursive(child, list);
                }
            }
        }

       
    }
}
